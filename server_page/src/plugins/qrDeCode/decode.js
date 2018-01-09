/**
 * QRCode Decode
 */
'use strict';
/**
 * QRCode Base
 */
'use strict';

/**
 QR-Logo: http://qrlogo.kaarposoft.dk
 
 Copyright (C) 2011 Henrik Kaare Poulsen
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 Parts of the Reed Solomon decoding algorithms have been inspired by
 http://rscode.sourceforge.net
 Original version Copyright (C) by Henry Minsky
 */

/**
 * JavaScript strict mode
 */
'use strict';

/**
 * ReedSolomon constructor
 */
function ReedSolomon(n_ec_bytes){
  this.n_ec_bytes = n_ec_bytes;
  this.n_degree_max = 2 * n_ec_bytes;
  this.syndroms = [];
  this.gen_poly = null;
  this.initGaloisTables();
}

/**
 * ReedSolomon prototype
 */
ReedSolomon.prototype = {
  /**
   * ReedSolomon main functions to be called by clients
   */
  encode: function (msg){
    var LFSR, i, dbyte, j, parity;
    
    // return parity bytes
    // Simulate a LFSR with generator polynomial for n byte RS code.
    if (this.gen_poly == null) { this.gen_poly = this.genPoly(this.n_ec_bytes); }
    
    LFSR = new Array(this.n_ec_bytes + 1);
    
    for (i = 0; i < this.n_ec_bytes + 1; i++) { LFSR[i] = 0; }
    
    for (i = 0; i < msg.length; i++) {
      dbyte = msg[i] ^ LFSR[this.n_ec_bytes - 1];
      
      for (j = this.n_ec_bytes - 1; j > 0; j--) {
        LFSR[j] = LFSR[j - 1] ^ this.gmult(this.gen_poly[j], dbyte);
      }
      
      LFSR[0] = this.gmult(this.gen_poly[0], dbyte);
    }
    
    parity = [];
    
    for (i = this.n_ec_bytes - 1; i >= 0; i--) { parity.push(LFSR[i]); }
    
    return parity;
  },
  decode: function (bytes_in){
    var n_err;
    
    this.bytes_in = bytes_in;
    this.bytes_out = bytes_in.slice();
    
    n_err = this.calculateSyndroms();
    
    if (n_err > 0) {
      this.correctErrors();
    } else {
      this.corrected = true;
    }
    
    return this.bytes_out.slice(0, this.bytes_out.length - this.n_ec_bytes);
  },
  /**
   * ReedSolomon implementation
   */
  genPoly: function (nbytes){
    var tp, tp1, genpoly, i;
    
    // multiply (x + a^n) for n = 1 to nbytes
    tp1 = this.zeroPoly();
    tp1[0] = 1;
    
    for (i = 0; i < nbytes; i++) {
      tp = this.zeroPoly();
      tp[0] = this.gexp[i]; // set up x+a^n
      tp[1] = 1;
      genpoly = this.multPolys(tp, tp1);
      tp1 = this.copyPoly(genpoly);
    }
    
    return genpoly;
  },
  calculateSyndroms: function (){
    var sum, n_err = 0, i, j;
    
    this.syndroms = [];
    
    for (j = 0; j < this.n_ec_bytes; j++) {
      sum = 0;
      
      for (i = 0; i < this.bytes_in.length; i++) {
        sum = this.bytes_in[i] ^ this.gmult(this.gexp[j], sum);
      }
      
      this.syndroms.push(sum);
      
      if (sum > 0) { n_err++; }
    }
    
    return n_err;
  },
  correctErrors: function (){
    var e, r, i, num, j, denom, err;
    
    this.berlekampMassey();
    this.findRoots();
    
    this.corrected = false;
    
    if (2 * this.n_errors > this.n_ec_bytes) {
      this.uncorrected_reason = 'Too many errors';
      
      return;
    }
    
    for (e = 0; e < this.n_errors; e++) {
      if (this.error_locs[e] >= this.bytes_in.length) {
        this.uncorrected_reason = 'Corrections out of scope';
        
        return;
      }
    }
    
    if (this.n_errors === 0) {
      this.uncorrected_reason = 'Could not identify errors';
      
      return;
    }
    
    for (r = 0; r < this.n_errors; r++) {
      i = this.error_locs[r];
      // evaluate omega at alpha^(-i)
      num = 0;
      
      for (j = 0; j < this.n_degree_max; j++) {
        num ^= this.gmult(this.omega[j], this.gexp[((255 - i) * j) % 255]);
      }
      
      // evaluate psi' (derivative) at alpha^(-i) ; all odd powers disappear
      denom = 0;
      
      for (j = 0; j < this.n_degree_max; j += 2) {
        denom ^= this.gmult(this.psi[j], this.gexp[((255 - i) * (j)) % 255]);
      }
      
      err = this.gmult(num, this.ginv(denom));
      
      this.bytes_out[this.bytes_out.length - i - 1] ^= err;
    }
    
    this.corrected = true;
  },
  berlekampMassey: function (){
    // initialize Gamma, the erasure locator polynomial
    var gamma = this.zeroPoly(), D, psi2, k, L, i, n, d, L2, om;
    
    gamma[0] = 1;
    
    // initialize to z
    D = this.copyPoly(gamma);
    
    this.mulZPoly(D);
    this.psi = this.copyPoly(gamma);
    
    psi2 = new Array(this.n_degree_max);
    k = -1;
    L = 0;
    
    for (n = 0; n < this.n_ec_bytes; n++) {
      d = this.computeDiscrepancy(this.psi, this.syndroms, L, n);
      
      if (d !== 0) {
        for (i = 0; i < this.n_degree_max; i++) {
          psi2[i] = this.psi[i] ^ this.gmult(d, D[i]);
        }
        
        if (L < (n - k)) {
          L2 = n - k;
          k = n - L;
          
          for (i = 0; i < this.n_degree_max; i++) {
            D[i] = this.gmult(this.psi[i], this.ginv(d));
          }
          
          L = L2;
        }
        
        this.psi = this.copyPoly(psi2);
      }
      
      this.mulZPoly(D);
    }
    
    // omega
    om = this.multPolys(this.psi, this.syndroms);
    
    this.omega = this.zeroPoly();
    
    for (i = 0; i < this.n_ec_bytes; i++) {
      this.omega[i] = om[i];
    }
  },
  findRoots: function (){
    var sum, r, k;
    
    this.n_errors = 0;
    this.error_locs = [];
    
    for (r = 1; r < 256; r++) {
      sum = 0;
      // evaluate psi at r
      for (k = 0; k < this.n_ec_bytes + 1; k++) {
        sum ^= this.gmult(this.gexp[(k * r) % 255], this.psi[k]);
      }
      
      if (sum === 0) {
        this.error_locs.push(255 - r);
        this.n_errors++;
      }
    }
  },
  /**
   * Polynome functions
   */
  computeDiscrepancy: function (lambda, S, L, n){
    var sum = 0, i;
    
    for (i = 0; i <= L; i++) {
      sum ^= this.gmult(lambda[i], S[n - i]);
    }
    
    return sum;
  },
  copyPoly: function (src){
    var dst = new Array(this.n_degree_max), i;
    
    for (i = 0; i < this.n_degree_max; i++) {
      dst[i] = src[i];
    }
    
    return dst;
  },
  zeroPoly: function (){
    var poly = new Array(this.n_degree_max), i;
    
    for (i = 0; i < this.n_degree_max; i++) {
      poly[i] = 0;
    }
    
    return poly;
  },
  mulZPoly: function (poly){
    var i;
    
    for (i = this.n_degree_max - 1; i > 0; i--) {
      poly[i] = poly[i - 1];
    }
    
    poly[0] = 0;
  },
  /**
   * polynomial multiplication
   */
  multPolys: function (p1, p2){
    var dst = new Array(this.n_degree_max),
      tmp1 = new Array(this.n_degree_max * 2),
      i, j;
    
    for (i = 0; i < (this.n_degree_max * 2); i++) { dst[i] = 0; }
    for (i = 0; i < this.n_degree_max; i++) {
      for (j = this.n_degree_max; j < (this.n_degree_max * 2); j++) { tmp1[j] = 0; }
      // scale tmp1 by p1[i]
      for (j = 0; j < this.n_degree_max; j++) { tmp1[j] = this.gmult(p2[j], p1[i]); }
      // and mult (shift) tmp1 right by i
      for (j = (this.n_degree_max * 2) - 1; j >= i; j--) { tmp1[j] = tmp1[j - i]; }
      for (j = 0; j < i; j++) { tmp1[j] = 0; }
      // add into partial product
      for (j = 0; j < (this.n_degree_max * 2); j++) { dst[j] ^= tmp1[j]; }
    }
    
    return dst;
  },
  /**
   * Galois field functions
   */
  initGaloisTables: function (){
    var pinit = 0,
      p1 = 1,
      p2 = 0,
      p3 = 0,
      p4 = 0,
      p5 = 0,
      p6 = 0,
      p7 = 0,
      p8 = 0,
      i, z;
    
    this.gexp = new Array(512);
    this.glog = new Array(256);
    this.gexp[0] = 1;
    this.gexp[255] = this.gexp[0];
    this.glog[0] = 0;
    
    for (i = 1; i < 256; i++) {
      pinit = p8;
      p8 = p7;
      p7 = p6;
      p6 = p5;
      p5 = p4 ^ pinit;
      p4 = p3 ^ pinit;
      p3 = p2 ^ pinit;
      p2 = p1;
      p1 = pinit;
      this.gexp[i] = p1 + p2 * 2 + p3 * 4 + p4 * 8 + p5 * 16 + p6 * 32 + p7 * 64 + p8 * 128;
      this.gexp[i + 255] = this.gexp[i];
    }
    
    for (i = 1; i < 256; i++) {
      for (z = 0; z < 256; z++) {
        if (this.gexp[z] === i) {
          this.glog[i] = z;
          break;
        }
      }
    }
  },
  gmult: function (a, b){
    var i, j;
    
    if (a === 0 || b === 0) { return (0); }
    
    i = this.glog[a];
    j = this.glog[b];
    
    return this.gexp[i + j];
  },
  ginv: function (elt){
    return (this.gexp[255 - this.glog[elt]]);
  }
};


var QRBase = {
  /**
   * 编码格式
   */
  MODE: {
    Numeric: 1,
    AlphaNumeric: 2,
    EightBit: 4,
    Terminator: 0
  },
  /**
   * 纠错等级
   */
  ERROR_CORRECTION_LEVEL: {
    L: 1, //  7%
    M: 0, // 15%
    Q: 3, // 25%
    H: 2  // 30%
  },
  /**
   * 二维码异常
   * @param message 错误消息
   * @param errorCode 错误码
   * @param errorData 错误数据
   * @constructor QRError
   */
  QRError: function (message, errorCode, errorData){
    this.message = message;
    this.errorCode = errorCode;
    this.errorData = errorData;
  },
  setBlocks: function (qr){
    var nCodewords = this.nCodewords[qr.version],
      nECCodewords = this.nECCodewords[qr.version][qr.ECLevel],
      ECBlocks = this.ECBlocks[qr.version][qr.ECLevel],
      nBlocks,
      nBlocksFirst,
      nBlocksSecond,
      nBlockWordsFirst,
      nBlockWordsSecond,
      i, b, w = 0;
    
    qr.nDataCodewords = nCodewords - nECCodewords;
    
    if (ECBlocks.length === 1) {
      nBlocksFirst = ECBlocks[0];
      nBlocksSecond = 0;
      nBlocks = nBlocksFirst;
      nBlockWordsFirst = qr.nDataCodewords / nBlocks;
      nBlockWordsSecond = 0;
    } else {
      nBlocksFirst = ECBlocks[0];
      nBlocksSecond = ECBlocks[1];
      nBlocks = nBlocksFirst + nBlocksSecond;
      nBlockWordsFirst = Math.floor(qr.nDataCodewords / nBlocks);
      nBlockWordsSecond = nBlockWordsFirst + 1;
    }
    
    qr.nBlockEcWords = nECCodewords / nBlocks;
    qr.blockDataLengths = [];
    
    for (b = 0; b < nBlocksFirst; b++) {
      qr.blockDataLengths[b] = nBlockWordsFirst;
    }
    
    for (b = nBlocksFirst; b < nBlocks; b++) {
      qr.blockDataLengths[b] = nBlockWordsSecond;
    }
    
    qr.blockIndices = [];
    
    for (b = 0; b < nBlocks; b++) {
      qr.blockIndices[b] = [];
    }
    
    for (i = 0; i < nBlockWordsFirst; i++) {
      for (b = 0; b < nBlocks; b++) {
        qr.blockIndices[b].push(w);
        w++;
      }
    }
    
    for (b = nBlocksFirst; b < nBlocks; b++) {
      qr.blockIndices[b].push(w);
      w++;
    }
    
    for (i = 0; i < qr.nBlockEcWords; i++) {
      for (b = 0; b < nBlocks; b++) {
        qr.blockIndices[b].push(w);
        w++;
      }
    }
  },
  setFunctionalPattern: function (qr){
    var x, y;
    
    function markSquare(qr, x, y, w, h){
      var i, j;
      for (i = x; i < x + w; i++) {
        for (j = y; j < y + h; j++) {
          qr.functionalPattern[i][j] = true;
        }
      }
    }
    
    function markAlignment(qr, qrbase){
      var n = qrbase.alignmentPatterns[qr.version].length,
        i, j;
      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          if (((i === 0) && (j === 0)) || ((i === 0) && (j === n - 1)) || ((i === n - 1) && (j === 0))) {
            continue;
          }
          
          markSquare(qr,
            qrbase.alignmentPatterns[qr.version][i] - 2,
            qrbase.alignmentPatterns[qr.version][j] - 2,
            5, 5);
        }
      }
    }
    
    // setFunctionalPattern
    qr.functionalPattern = [];
    
    for (x = 0; x < qr.nModules; x++) {
      qr.functionalPattern[x] = [];
      
      for (y = 0; y < qr.nModules; y++) {
        qr.functionalPattern[x][y] = false;
      }
    }
    
    // Finder and Format
    markSquare(qr, 0, 0, 9, 9);
    markSquare(qr, qr.nModules - 8, 0, 8, 9);
    markSquare(qr, 0, qr.nModules - 8, 9, 8);
    
    // Timing
    markSquare(qr, 8, 6, qr.nModules - 8 - 8, 1);
    markSquare(qr, 6, 8, 1, qr.nModules - 8 - 8);
    
    // Alignment
    markAlignment(qr, this);
    
    // Version
    if (qr.version >= 7) {
      markSquare(qr, 0, qr.nModules - 11, 6, 3);
      markSquare(qr, qr.nModules - 11, 0, 3, 6);
    }
  },
  /**
   * 计算数据长度的编码字节数
   */
  nCountBits: function (mode, version){
    if (mode === this.MODE.EightBit) {
      if (version < 10) {
        return 8;
      } else {
        return 16;
      }
    } else if (mode === this.MODE.AlphaNumeric) {
      if (version < 10) {
        return 9;
      } else if (version < 27) {
        return 11;
      } else {
        return 13;
      }
    } else if (mode === this.MODE.Numeric) {
      if (version < 10) {
        return 10;
      } else if (version < 27) {
        return 12;
      } else {
        return 14;
      }
    }
    
    throw new this.QRError('Internal error: Unknown mode: ' + mode, 0, mode);
  },
  /**
   * 从版本计算二维码宽度
   */
  nModulesFromVersion: function (version){
    return 17 + 4 * version;
  },
  /**
   * UTF-8 和 Unicode 的相互转换
   */
  unicodeToUtf8: function (string){
    var out = '',
      len = string.length,
      i, c;
    
    for (i = 0; i < len; i++) {
      c = string.charCodeAt(i);
      
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += string.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    
    return out;
  },
  utf8Tounicode: function (string){
    var out = '',
      len = string.length,
      i = 0,
      mark, char1, char2, char3;
    
    while (i < len) {
      char1 = string.charCodeAt(i++);
      mark = char1 >> 4;
      
      if (mark <= 7) {
        // 0xxxxxxx
        out += string.charAt(i - 1);
      } else if (mark === 12 || mark === 13) {
        // 110x xxxx   10xx xxxx
        char2 = string.charCodeAt(i++);
        out += String.fromCharCode(((char1 & 0x1F) << 6) | (char2 & 0x3F));
      } else if (mark === 14) {
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = string.charCodeAt(i++);
        char3 = string.charCodeAt(i++);
        out += String.fromCharCode(((char1 & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
      }
    }
    
    return out;
  },
  /**
   * QRCode constants
   */
  alignmentPatterns: [
    null,
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ],
  versionInfo: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    0x07C94,
    0x085BC,
    0x09A99,
    0x0A4D3,
    0x0BBF6,
    0x0C762,
    0x0D847,
    0x0E60D,
    0x0F928,
    0x10B78,
    0x1145D,
    0x12A17,
    0x13532,
    0x149A6,
    0x15683,
    0x168C9,
    0x177EC,
    0x18EC4,
    0x191E1,
    0x1AFAB,
    0x1B08E,
    0x1CC1A,
    0x1D33F,
    0x1ED75,
    0x1F250,
    0x209D5,
    0x216F0,
    0x228BA,
    0x2379F,
    0x24B0B,
    0x2542E,
    0x26A64,
    0x27541,
    0x28C69
  ],
  formatInfo: [
    0x5412,
    0x5125,
    0x5E7C,
    0x5B4B,
    0x45F9,
    0x40CE,
    0x4F97,
    0x4AA0,
    0x77C4,
    0x72F3,
    0x7DAA,
    0x789D,
    0x662F,
    0x6318,
    0x6C41,
    0x6976,
    0x1689,
    0x13BE,
    0x1CE7,
    0x19D0,
    0x0762,
    0x0255,
    0x0D0C,
    0x083B,
    0x355F,
    0x3068,
    0x3F31,
    0x3A06,
    0x24B4,
    0x2183,
    0x2EDA,
    0x2BED
  ],
  /**
   * 每个版本容纳的字节数
   */
  nCodewords: [
    0,
    26,
    44,
    70,
    100,
    134,
    172,
    196,
    242,
    292,
    346,
    404,
    466,
    532,
    581,
    655,
    733,
    815,
    901,
    991,
    1085,
    1156,
    1258,
    1364,
    1474,
    1588,
    1706,
    1828,
    1921,
    2051,
    2185,
    2323,
    2465,
    2611,
    2761,
    2876,
    3034,
    3196,
    3362,
    3532,
    3706
  ],
  nECCodewords: [
    null,
    [10, 7, 17, 13],
    [16, 10, 28, 22],
    [26, 15, 44, 36],
    [36, 20, 64, 52],
    [48, 26, 88, 72],
    [64, 36, 112, 96],
    [72, 40, 130, 108],
    [88, 48, 156, 132],
    [110, 60, 192, 160],
    [130, 72, 224, 192],
    [150, 80, 264, 224],
    [176, 96, 308, 260],
    [198, 104, 352, 288],
    [216, 120, 384, 320],
    [240, 132, 432, 360],
    [280, 144, 480, 408],
    [308, 168, 532, 448],
    [338, 180, 588, 504],
    [364, 196, 650, 546],
    [416, 224, 700, 600],
    [442, 224, 750, 644],
    [476, 252, 816, 690],
    [504, 270, 900, 750],
    [560, 300, 960, 810],
    [588, 312, 1050, 870],
    [644, 336, 1110, 952],
    [700, 360, 1200, 1020],
    [728, 390, 1260, 1050],
    [784, 420, 1350, 1140],
    [812, 450, 1440, 1200],
    [868, 480, 1530, 1290],
    [924, 510, 1620, 1350],
    [980, 540, 1710, 1440],
    [1036, 570, 1800, 1530],
    [1064, 570, 1890, 1590],
    [1120, 600, 1980, 1680],
    [1204, 630, 2100, 1770],
    [1260, 660, 2220, 1860],
    [1316, 720, 2310, 1950],
    [1372, 750, 2430, 2040]
  ],
  ECBlocks: [
    [],
    [
      [1],
      [1],
      [1],
      [1]
    ],
    [
      [1],
      [1],
      [1],
      [1]
    ],
    [
      [1],
      [1],
      [2],
      [2]
    ],
    [
      [2],
      [1],
      [4],
      [2]
    ],
    [
      [2],
      [1],
      [2, 2],
      [2, 2]
    ],
    [
      [4],
      [2],
      [4],
      [4]
    ],
    [
      [4],
      [2],
      [4, 1],
      [2, 4]
    ],
    [
      [2, 2],
      [2],
      [4, 2],
      [4, 2]
    ],
    [
      [3, 2],
      [2],
      [4, 4],
      [4, 4]
    ],
    [
      [4, 1],
      [2, 2],
      [6, 2],
      [6, 2]
    ],
    [
      [1, 4],
      [4],
      [3, 8],
      [4, 4]
    ],
    [
      [6, 2],
      [2, 2],
      [7, 4],
      [4, 6]
    ],
    [
      [8, 1],
      [4],
      [12, 4],
      [8, 4]
    ],
    [
      [4, 5],
      [3, 1],
      [11, 5],
      [11, 5]
    ],
    [
      [5, 5],
      [5, 1],
      [11, 7],
      [5, 7]
    ],
    [
      [7, 3],
      [5, 1],
      [3, 13],
      [15, 2]
    ],
    [
      [10, 1],
      [1, 5],
      [2, 17],
      [1, 15]
    ],
    [
      [9, 4],
      [5, 1],
      [2, 19],
      [17, 1]
    ],
    [
      [3, 11],
      [3, 4],
      [9, 16],
      [17, 4]
    ],
    [
      [3, 13],
      [3, 5],
      [15, 10],
      [15, 5]
    ],
    [
      [17],
      [4, 4],
      [19, 6],
      [17, 6]
    ],
    [
      [17],
      [2, 7],
      [34],
      [7, 16]
    ],
    [
      [4, 14],
      [4, 5],
      [16, 14],
      [11, 14]
    ],
    [
      [6, 14],
      [6, 4],
      [30, 2],
      [11, 16]
    ],
    [
      [8, 13],
      [8, 4],
      [22, 13],
      [7, 22]
    ],
    [
      [19, 4],
      [10, 2],
      [33, 4],
      [28, 6]
    ],
    [
      [22, 3],
      [8, 4],
      [12, 28],
      [8, 26]
    ],
    [
      [3, 23],
      [3, 10],
      [11, 31],
      [4, 31]
    ],
    [
      [21, 7],
      [7, 7],
      [19, 26],
      [1, 37]
    ],
    [
      [19, 10],
      [5, 10],
      [23, 25],
      [15, 25]
    ],
    [
      [2, 29],
      [13, 3],
      [23, 28],
      [42, 1]
    ],
    [
      [10, 23],
      [17],
      [19, 35],
      [10, 35]
    ],
    [
      [14, 21],
      [17, 1],
      [11, 46],
      [29, 19]
    ],
    [
      [14, 23],
      [13, 6],
      [59, 1],
      [44, 7]
    ],
    [
      [12, 26],
      [12, 7],
      [22, 41],
      [39, 14]
    ],
    [
      [6, 34],
      [6, 14],
      [2, 64],
      [46, 10]
    ],
    [
      [29, 14],
      [17, 4],
      [24, 46],
      [49, 10]
    ],
    [
      [13, 32],
      [4, 18],
      [42, 32],
      [48, 14]
    ],
    [
      [40, 7],
      [20, 4],
      [10, 67],
      [43, 22]
    ],
    [
      [18, 31],
      [19, 6],
      [20, 61],
      [34, 34]
    ]
  ]
};

// 二维码异常
QRBase.QRError.prototype = new Error();
QRBase.QRError.prototype.name = 'QRError';
QRBase.QRError.prototype.constructor = QRBase.QRError;

function QRDecode(){
  this.image = null;
  this.imageTop = 0;
  this.imageBottom = 0;
  this.imageLeft = 0;
  this.imageRight = 0;
  this.nModules = 0;
  this.moduleSize = 0;
  this.version = 0;
  this.functionalGrade = 0;
  this.ECLevel = 0;
  this.mask = 0;
  this.maskPattern = [];
  this.nBlockEcWords = 0;
  this.blockIndices = [];
  this.blockDataLengths = [];
}

QRDecode.prototype = {
  /**
   * Decode a pixel array
   * @param pix
   * @returns {*}
   */
  decodePix: function (pix){
    return this.decodeImage(pix);
  },
  /**
   * Decode image data as QR Code
   * @param imageData    The image data (canvas.getContext('2d').getImageData, pixel array or similar)
   * @param imageWidth   The pixel width of the image
   * @param imageHeight  The pixel height of the image
   */
  decodeImageData: function (imageData, imageWidth, imageHeight){
    this.setImageData(imageData, imageWidth, imageHeight);

    return this.decode();
  },
  /**
   * Decode image data as QR Code
   * @param imageData    The image data (canvas.getContext('2d').getImageData, pixel array or similar)
   * @param imageWidth   The pixel width of the image
   * @param imageHeight  The pixel height of the image
   * @param left         Leftmost pixel of image
   * @param right        Rightmost pixel of image
   * @param top          Top pixel of image
   * @param bottom       Bottom pixel of image
   * @param maxVersion   Do not try to decode with version higher than this
   */
  decodeImageDataInsideBordersWithMaxVersion: function (imageData, imageWidth, imageHeight, left, right, top, bottom, maxVersion){
    this.setImageData(imageData, imageWidth, imageHeight);
    this.imageLeft = left;
    this.imageRight = right;
    this.imageTop = top;
    this.imageBottom = bottom;
    this.imageSize = ((this.imageRight - this.imageLeft + 1) + (this.imageBottom - this.imageTop + 1)) / 2.0;
    this.maxVersion = maxVersion;

    return this.decodeInsideBordersWithMaxVersion();
  },
  /**
   * Set image data in preparation for decoding QR Code
   * @param imageData    The image data (canvas.getContext('2d').getImageData, pixel array or similar)
   * @param imageWidth   The pixel width of the image
   * @param imageHeight  The pixel height of the image
   */
  setImageData: function (imageData, imageWidth, imageHeight){
    var total = 0,
      x, y, p, v;

    imageData.minCol = 255;
    imageData.maxCol = 0;

    for (x = 0; x < imageWidth; x++) {
      for (y = 0; y < imageHeight; y++) {
        p = x * 4 + y * imageWidth * 4;
        v = 0.30 * imageData.data[p] + 0.59 * imageData.data[p + 1] + 0.11 * imageData.data[p + 2];
        total += v;

        if (v < imageData.minCol) {
          imageData.minCol = v;
        }

        if (v > imageData.maxCol) {
          imageData.maxCol = v;
        }
      }
    }

    if (imageData.maxCol - imageData.minCol < 255 / 10) {
      throw new QRBase.QRError(
        'Image does not have enough contrast (this.image_data.min_col='
        + imageData.minCol + ' this.image_data.max_col=' + imageData.maxCol + ')',
        2, { minCol: imageData.minCol, maxCol: imageData.maxCol });
    }

    imageData.threshold = total / (imageWidth * imageHeight);

    imageData.getGray = function (x, y, d){
      var n = 0,
        i, j, p;

      for (i = x; i < x + d; i++) {
        for (j = y; j < y + d; j++) {
          p = i * 4 + j * this.width * 4;
          n = n + 0.30 * this.data[p] + 0.59 * this.data[p + 1] + 0.11 * this.data[p + 2];
        }
      }

      return n / d / d;
    };

    imageData.isDark = function (x, y, d){
      var g = this.getGray(x, y, d);
      return g < this.threshold;
    };

    this.image = imageData;
  },
  /**
   * Decode a QR Code in an image.
   * The image MUST already have .getGray set
   */
  decodeImage: function (image){
    this.image = image;

    return this.decode();
  },
  /**
   * Decode a QR Code in an image which has already been set.
   */
  decode: function (){
    this.findImageBorders();
    this.maxVersion = 40;
    this.decodeInsideBordersWithMaxVersion();

    return this.data;
  },
  /**
   * Decode a QR Code in an image which has already been set -
   * inside borders already defined
   */
  decodeInsideBordersWithMaxVersion: function (){
    this.findModuleSize();
    QRBase.setFunctionalPattern(this);
    this.extractCodewords();
    QRBase.setBlocks(this);
    this.correctErrors();
    this.extractData();

    return this.data;
  },
  /**
   * QRCode internal decoding functions
   */
  findImageBorders: function (){
    var i, j, n,
      limit = 7,
      skewLimit = 2;

    for (i = 0; i < this.image.width; i++) {
      n = 0;

      for (j = 0; j < this.image.height; j++) {
        n = n + this.image.isDark(i, j, 1);
      }

      if (n >= limit) {
        break;
      }
    }

    this.imageLeft = i;

    for (i = this.image.width - 1; i >= 0; i--) {
      n = 0;

      for (j = 0; j < this.image.height; j++) {
        n = n + this.image.isDark(i, j, 1);
      }

      if (n >= limit) {
        break;
      }
    }

    this.imageRight = i;

    for (j = 0; j < this.image.height; j++) {
      n = 0;

      for (i = 0; i < this.image.width; i++) {
        n = n + this.image.isDark(i, j, 1);
      }

      if (n >= limit) {
        break;
      }
    }

    this.imageTop = j;

    for (j = this.image.height - 1; j >= 0; j--) {
      n = 0;

      for (i = 0; i < this.image.width; i++) {
        n = n + this.image.isDark(i, j, 1);
      }

      if (n >= limit) {
        break;
      }
    }

    this.imageBottom = j;

    if ((this.imageRight - this.imageLeft + 1 < 21) || (this.imageBottom - this.imageTop + 1 < 21)) {
      throw new QRBase.QRError('Found no image data to decode', 3);
    }

    if (Math.abs((this.imageRight - this.imageLeft) - (this.imageBottom - this.imageTop)) > skewLimit) {
      throw new QRBase.QRError('Image data is not rectangular', 4);
    }

    this.imageSize = ((this.imageRight - this.imageLeft + 1) + (this.imageBottom - this.imageTop + 1)) / 2.0;
  },
  findModuleSize: function (){
    /**
     * returns number of matches found
     * perferct is 8*8 = 64
     */
    function matchFinderPattern(qr, x, y, quietX, quietY, moduleSize){
      var i, j,
        n = 0;

      // Outer 7x7 black boundary
      for (i = 0; i <= 5; i++) {
        if (qr.isDarkWithSize(x + i, y, moduleSize)) {
          n = n + 1;
        }

        if (qr.isDarkWithSize(x + 6, y + i, moduleSize)) {
          n = n + 1;
        }

        if (qr.isDarkWithSize(x + 6 - i, y + 6, moduleSize)) {
          n = n + 1;
        }

        if (qr.isDarkWithSize(x, y + 6 - i, moduleSize)) {
          n = n + 1;
        }
      }

      // Intermediate 5*5 white
      for (i = 0; i <= 3; i++) {
        if (!qr.isDarkWithSize(x + i + 1, y + 1, moduleSize)) {
          n = n + 1;
        }

        if (!qr.isDarkWithSize(x + 5, y + i + 1, moduleSize)) {
          n = n + 1;
        }

        if (!qr.isDarkWithSize(x + 5 - i, y + 5, moduleSize)) {
          n = n + 1;
        }

        if (!qr.isDarkWithSize(x + 1, y + 5 - i, moduleSize)) {
          n = n + 1;
        }
      }

      // Inner 3*3 black box
      for (i = 0; i <= 2; i++) {
        for (j = 0; j <= 2; j++) {
          if (qr.isDarkWithSize(3 + x, 3 + y, moduleSize)) {
            n = n + 1;
          }
        }
      }

      // quiet area
      for (i = 0; i <= 6; i++) {
        if (!qr.isDarkWithSize(x + quietX, y + i, moduleSize)) {
          n = n + 1;
        }

        if (!qr.isDarkWithSize(x + i, y + quietY, moduleSize)) {
          n = n + 1;
        }
      }

      // 'bottom right' quiet area
      if (!qr.isDarkWithSize(x + quietX, y + quietY, moduleSize)) {
        n = n + 1;
      }

      return n;
    }

    function matchTimingPattern(qr, horizontal, nModules, moduleSize){
      var n = 0,
        x0 = 6,
        y0 = 8,
        dx = 0,
        dy = 1,
        consecutive = 5,
        ok = [],
        c,
        black = true,
        i,
        x, y,
        last5;

      if (horizontal) {
        x0 = 8;
        y0 = 6;
        dx = 1;
        dy = 0;
      }

      for (c = 0; c < consecutive; c++) {
        ok.push(1);
      }

      for (i = 0; i < nModules - 8 - 8; i++) {
        x = x0 + i * dx;
        y = y0 + i * dy;

        if (black === qr.isDarkWithSize(x, y, moduleSize)) {
          n++;
          ok.push(1);
        } else {
          ok.push(0);
        }

        black = !black;
        last5 = 0;

        for (c = ok.length - consecutive; c < ok.length - 1; c++) {
          if (ok[c]) {
            last5 = last5 + 1;
          }
        }

        if (last5 < 3) {
          return 0;
        }
      }

      return n;
    }

    function matchOneAlignmentPattern(qr, x, y, moduleSize){
      var n = 0,
        i;

      // Outer 5x5 black boundary
      for (i = 0; i <= 3; i++) {
        if (qr.isDarkWithSize(x + i, y, moduleSize)) {
          n = n + 1;
        }

        if (qr.isDarkWithSize(x + 4, y + i, moduleSize)) {
          n = n + 1;
        }

        if (qr.isDarkWithSize(x + 4 - i, y + 4, moduleSize)) {
          n = n + 1;
        }

        if (qr.isDarkWithSize(x, y + 4 - i, moduleSize)) {
          n = n + 1;
        }
      }

      // Intermediate 3*3 white
      for (i = 0; i <= 1; i++) {
        if (!qr.isDarkWithSize(x + i + 1, y + 1, moduleSize)) {
          n = n + 1;
        }

        if (!qr.isDarkWithSize(x + 3, y + i + 1, moduleSize)) {
          n = n + 1;
        }

        if (!qr.isDarkWithSize(x + 3 - i, y + 3, moduleSize)) {
          n = n + 1;
        }

        if (!qr.isDarkWithSize(x + 1, y + 3 - i, moduleSize)) {
          n = n + 1;
        }
      }

      // center black
      if (qr.isDarkWithSize(x + 2, y + 2, moduleSize)) {
        n = n + 1;
      }

      return n;
    }

    function matchAlignmentPatterns(qr, version, moduleSize){
      var a = 0,
        n = QRBase.alignmentPatterns[version].length,
        i, j, na;

      for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
          if (((i === 0) && (j === 0)) || ((i === 0) && (j === n - 1)) || ((i === n - 1) && (j === 0))) {
            continue;
          }

          na = matchOneAlignmentPattern(
            qr,
            QRBase.alignmentPatterns[version][i] - 2,
            QRBase.alignmentPatterns[version][j] - 2,
            moduleSize
          );

          if (na > 24) { a++; }
        }
      }

      return a;
    }

    function matchVersionCode(qr, pattern){
      var v, hd;

      for (v = 7; v <= 40; v++) {
        hd = qr.hammingDistance(pattern, QRBase.versionInfo[v]);
        if (hd <= 3) { return [v, hd]; }
      }

      return [0, 4];
    }

    function matchVersionTopright(qr, nModules, moduleSize){
      var factor = 1,
        pattern = 0,
        x, y;

      for (y = 0; y < 6; y++) {
        for (x = nModules - 11; x < nModules - 11 + 3; x++) {
          if (qr.isDarkWithSize(x, y, moduleSize)) {
            pattern += factor;
          }
          factor *= 2;
        }
      }

      return matchVersionCode(qr, pattern);
    }

    function matchVersionBottomleft(qr, nModules, moduleSize){
      var factor = 1,
        pattern = 0,
        x, y;

      for (x = 0; x < 6; x++) {
        for (y = nModules - 11; y < nModules - 11 + 3; y++) {
          if (qr.isDarkWithSize(x, y, moduleSize)) {
            pattern += factor;
          }

          factor *= 2;
        }
      }

      return matchVersionCode(qr, pattern);
    }

    function matchFormatCode(qr, pattern){
      var f, hd;

      for (f = 0; f < 32; f++) {
        hd = qr.hammingDistance(pattern, QRBase.formatInfo[f]);

        if (hd <= 3) {
          return [f, hd];
        }
      }

      return [0, 4];
    }

    function matchFormatNW(qr, nModules, moduleSize){
      var factor = 1,
        pattern = 0,
        x = 8,
        y;

      for (y = 0; y <= 5; y++) {
        if (qr.isDarkWithSize(x, y, moduleSize)) {
          pattern += factor;
        }

        factor *= 2;
      }

      if (qr.isDarkWithSize(8, 7, moduleSize)) {
        pattern += factor;
      }

      factor *= 2;

      if (qr.isDarkWithSize(8, 8, moduleSize)) {
        pattern += factor;
      }

      factor *= 2;

      if (qr.isDarkWithSize(7, 8, moduleSize)) {
        pattern += factor;
      }

      factor *= 2;
      y = 8;

      for (x = 5; x >= 0; x--) {
        if (qr.isDarkWithSize(x, y, moduleSize)) {
          pattern += factor;
        }

        factor *= 2;
      }

      return matchFormatCode(qr, pattern);
    }

    function matchFormatNESW(qr, nModules, moduleSize){
      var factor = 1,
        pattern = 0,
        x,
        y = 8;

      for (x = nModules - 1; x > nModules - 1 - 8; x--) {
        if (qr.isDarkWithSize(x, y, moduleSize)) {
          pattern += factor;
        }

        factor *= 2;
      }

      x = 8;

      for (y = nModules - 7; y < nModules - 1; y++) {
        if (qr.isDarkWithSize(x, y, moduleSize)) {
          pattern += factor;
        }

        factor *= 2;
      }

      return matchFormatCode(qr, pattern);
    }

    function gradeFinderPatterns(finderPattern){
      var g = 4,
        i;

      for (i = 0; i < 3; i++) {
        g = g - (64 - finderPattern[i]);
      }

      if (g < 0) {
        g = 0;
      }

      return g;
    }

    function gradeTimingPatterns(timingPattern, n){
      var t = (timingPattern[0] + timingPattern[1]) / (2 * n);

      t = 1 - t;

      if (t >= 0.14) {
        return 0;
      }

      if (t >= 0.11) {
        return 1;
      }

      if (t >= 0.07) {
        return 2;
      }

      if (t >= 0.00001) {
        return 3;
      }

      return 4;
    }

    function gradeAlignmentPatterns(alignmentPatterns, n){
      var a = alignmentPatterns / n;

      a = 1 - a;

      if (a >= 0.30) {
        return 0;
      }

      if (a >= 0.20) {
        return 1;
      }

      if (a >= 0.10) {
        return 2;
      }

      if (a >= 0.00001) {
        return 3;
      }

      return 4;
    }

    function matchVersion(qr, version){
      var g,
        grades = [],
        nModules = QRBase.nModulesFromVersion(version),
        moduleSize = qr.imageSize / nModules,
        finderPattern = [0, 0, 0],
        versionTopright = [0, 0],
        versionBottomleft = [0, 0],
        timingPattern = [0, 0],
        alignmentPatterns = -3,
        format = 0,
        v1, formatNW, formatNESW,
        ECLevel, mask, grade = 4, i;

      finderPattern[0] = matchFinderPattern(qr, 0, 0, 7, 7, moduleSize);

      if (finderPattern[0] < 64 - 3) {
        return [version, 0]; // performance hack!
      }

      finderPattern[1] = matchFinderPattern(qr, 0, nModules - 7, 7, -1, moduleSize);

      if (finderPattern[0] + finderPattern[1] < 64 + 64 - 3) {
        return [version, 0]; // performance hack!
      }

      finderPattern[2] = matchFinderPattern(qr, nModules - 7, 0, -1, 7, moduleSize);
      g = gradeFinderPatterns(finderPattern);

      if (g < 1) {
        return [version, 0];
      } else {
        grades.push(g);
      }

      if (version >= 7) {
        versionTopright = matchVersionTopright(qr, nModules, moduleSize);
        versionBottomleft = matchVersionBottomleft(qr, nModules, moduleSize);
        v1 = version;

        if (versionTopright[1] < versionBottomleft[1]) {
          if (versionTopright[1] < 4) { v1 = versionTopright[0]; }
        } else {
          if (versionBottomleft[1] < 4) { v1 = versionBottomleft[0]; }
        }

        if (v1 !== version) {
          version = v1;
        }

        nModules = QRBase.nModulesFromVersion(version);
        moduleSize = qr.imageSize / nModules;
        g = Math.round(((4 - versionTopright[1]) + (4 - versionBottomleft[1])) / 2);

        if (g < 1) {
          return [version, 0];
        } else {
          grades.push(g);
        }
      }

      timingPattern[0] = matchTimingPattern(qr, true, nModules, moduleSize);
      timingPattern[1] = matchTimingPattern(qr, false, nModules, moduleSize);
      g = gradeTimingPatterns(timingPattern, nModules - 8 - 8);

      if (g < 1) {
        return [version, 0];
      } else {
        grades.push(g);
      }

      if (version > 1) {
        alignmentPatterns = matchAlignmentPatterns(qr, version, moduleSize);
      }

      g = gradeAlignmentPatterns(alignmentPatterns,
        QRBase.alignmentPatterns[version].length * QRBase.alignmentPatterns[version].length - 3);

      if (g < 1) {
        return [version, 0];
      } else {
        grades.push(g);
      }

      formatNW = matchFormatNW(qr, nModules, moduleSize);
      formatNESW = matchFormatNESW(qr, nModules, moduleSize);

      if (formatNW[1] < formatNESW[1]) {
        format = formatNW[0];
      } else {
        format = formatNESW[0];
      }

      ECLevel = Math.floor(format / 8);
      mask = format % 8;
      g = Math.round(((4 - formatNW[1]) + (4 - formatNESW[1])) / 2);

      if (g < 1) {
        return [version, 0];
      } else {
        grades.push(g);
      }

      for (i = 0; i < grades.length; i++) {
        if (grades[i] < grade) {
          grade = grades[i];
        }
      }

      return [version, grade, ECLevel, mask];
    }

    /**
     * findModuleSize
     */
    var bestMatchSoFar = [0, 0],
      version, match;

    for (version = 1; version <= this.maxVersion; version++) {
      match = matchVersion(this, version);

      if (match[1] > bestMatchSoFar[1]) { bestMatchSoFar = match; }
      if (match[1] === 4) { break; }
    }

    this.version = bestMatchSoFar[0];
    this.nModules = QRBase.nModulesFromVersion(this.version);
    this.moduleSize = this.imageSize / this.nModules;
    this.functionalGrade = bestMatchSoFar[1];
    this.ECLevel = bestMatchSoFar[2];
    this.mask = bestMatchSoFar[3];

    if (this.functionalGrade < 1) {
      throw new QRBase.QRError('Unable to decode a function pattern', 5);
    }
  },
  extractCodewords: function (){
    function getUnmasked(qr, j, i){
      var m, u;

      switch (qr.mask) {
        case 0:
          m = (i + j) % 2;
          break;
        case 1:
          m = i % 2;
          break;
        case 2:
          m = j % 3;
          break;
        case 3:
          m = (i + j) % 3;
          break;
        case 4:
          m = (Math.floor(i / 2) + Math.floor(j / 3)) % 2;
          break;
        case 5:
          m = (i * j) % 2 + (i * j) % 3;
          break;
        case 6:
          m = ((i * j) % 2 + (i * j) % 3) % 2;
          break;
        case 7:
          m = ((i + j) % 2 + (i * j) % 3) % 2;
          break;
      }

      if (m === 0) {
        u = !qr.isDark(j, i);
      } else {
        u = qr.isDark(j, i);
      }

      return u;
    }

    /**
     * extractCodewords
     * Original Java version by Sean Owen
     * Copyright 2007 ZXing authors
     */
    this.codewords = [];

    var readingUp = true,
      currentByte = 0,
      factor = 128,
      bitsRead = 0,
      i, j, col, count;

    // Read columns in pairs, from right to left
    for (j = this.nModules - 1; j > 0; j -= 2) {
      if (j === 6) {
        // Skip whole column with vertical alignment pattern;
        // saves time and makes the other code proceed more cleanly
        j--;
      }

      // Read alternatingly from bottom to top then top to bottom
      for (count = 0; count < this.nModules; count++) {
        i = readingUp ? this.nModules - 1 - count : count;

        for (col = 0; col < 2; col++) {
          // Ignore bits covered by the function pattern
          if (!this.functionalPattern[j - col][i]) {
            // Read a bit
            if (getUnmasked(this, j - col, i)) {
              currentByte += factor;
            }

            factor /= 2;

            // If we've made a whole byte, save it off
            if (factor < 1) {
              this.codewords.push(currentByte);
              bitsRead = 0;
              factor = 128;
              currentByte = 0;
            }
          }
        }
      }

      readingUp ^= true; // switch directions
    }
  },
  extractData: function (){
    function extract(qr, bytes, pos, len){
      // http://stackoverflow.com/questions/3846711/extract-bit-sequences-of-arbitrary-length-from-byte-array-efficiently
      var shift = 24 - (pos & 7) - len,
        mask = (1 << len) - 1,
        byteIndex = pos >>> 3;

      return (((bytes[byteIndex] << 16) | (bytes[++byteIndex] << 8) | bytes[++byteIndex]) >> shift) & mask;
    }

    function extract8bit(qr, bytes){
      var nCountBits = QRBase.nCountBits(QRBase.MODE.EightBit, qr.version),
        n = extract(qr, bytes, qr.bitIdx, nCountBits),
        data = '',
        i, a;

      qr.bitIdx += nCountBits;

      for (i = 0; i < n; i++) {
        a = extract(qr, bytes, qr.bitIdx, 8);
        data += String.fromCharCode(a);
        qr.bitIdx += 8;
      }

      return QRBase.utf8Tounicode(data);
    }

    function extractAlphanum(qr, bytes){
      var nCountBits = QRBase.nCountBits(QRBase.MODE.AlphaNumeric, qr.version),
        n = extract(qr, bytes, qr.bitIdx, nCountBits),
        data = '',
        i, x;

      qr.bitIdx += nCountBits;

      for (i = 0; i < Math.floor(n / 2); i++) {
        x = extract(qr, bytes, qr.bitIdx, 11);
        data += qr.alphanum[Math.floor(x / 45)];
        data += qr.alphanum[x % 45];
        qr.bitIdx += 11;
      }

      if (n % 2) {
        data += qr.alphanum[extract(qr, bytes, qr.bitIdx, 6)];
        qr.bitIdx += 6;
      }

      return data;
    }

    function extractNumeric(qr, bytes){
      var nCountBits = QRBase.nCountBits(QRBase.MODE.Numeric, qr.version),
        n = extract(qr, bytes, qr.bitIdx, nCountBits),
        data = '',
        x, c1, c2, c3,
        i;

      qr.bitIdx += nCountBits;

      for (i = 0; i < Math.floor(n / 3); i++) {
        x = extract(qr, bytes, qr.bitIdx, 10);
        qr.bitIdx += 10;
        c1 = Math.floor(x / 100);
        c2 = Math.floor((x % 100) / 10);
        c3 = x % 10;
        data += String.fromCharCode(48 + c1, 48 + c2, 48 + c3);
      }

      if (n % 3 === 1) {
        x = extract(qr, bytes, qr.bitIdx, 4);
        qr.bitIdx += 4;
        data += String.fromCharCode(48 + x);
      } else if (n % 3 === 2) {
        x = extract(qr, bytes, qr.bitIdx, 7);
        qr.bitIdx += 7;
        c1 = Math.floor(x / 10);
        c2 = x % 10;
        data += String.fromCharCode(48 + c1, 48 + c2);
      }

      return data;
    }

    // extractData
    var bytes = this.bytes,
      nBits = bytes.length * 8,
      i, mode;

    for (i = 0; i < 4; i++) {
      bytes.push(0);
    }

    this.data = '';
    this.bitIdx = 0;

    while (this.bitIdx < nBits - 4) {
      mode = extract(this, bytes, this.bitIdx, 4);
      this.bitIdx += 4;

      if (mode === QRBase.MODE.Terminator) { break; }
      else if (mode === QRBase.MODE.AlphaNumeric) { this.data += extractAlphanum(this, bytes); }
      else if (mode === QRBase.MODE.EightBit) { this.data += extract8bit(this, bytes); }
      else if (mode === QRBase.MODE.Numeric) { this.data += extractNumeric(this, bytes); }
      else { throw new QRBase.QRError('Unsupported ECI mode: ' + mode, 1, mode); }
    }
  },
  correctErrors: function (){
    var rs = new ReedSolomon(this.nBlockEcWords),
      errors = [],
      bytes = [],
      b,
      bytesIn, bytesOut,
      i;

    for (b = 0; b < this.blockIndices.length; b++) {
      bytesIn = [];

      for (i = 0; i < this.blockIndices[b].length; i++) {
        bytesIn.push(this.codewords[this.blockIndices[b][i]]);
      }

      bytesOut = rs.decode(bytesIn);

      if (!rs.corrected) {
        this.errorGrade = 0;
        throw new QRBase.QRError('Unable to correct errors (' + rs.uncorrected_reason + ')', 6, rs.uncorrected_reason);
      }

      bytes = bytes.concat(bytesOut);
      errors.push(rs.n_errors);
    }

    this.errors = errors;
    this.bytes = bytes;
    this.errorGrade = this.gradeErrors(errors);
  },
  gradeErrors: function (errors){
    var ecw = this.nBlockEcWords,
      max = 0,
      grade = 4,
      i;

    for (i = 0; i < errors.length; i++) {
      if (errors[i] > max) { max = errors[i]; }
    }

    if (max > ecw / 2 - 1) {
      grade = 0;
    } else if (max > ecw / 2 - 2) {
      grade = 1;
    } else if (max > ecw / 2 - 3) {
      grade = 2;
    } else if (max > ecw / 2 - 4) {
      grade = 3;
    }

    return grade;
  },
  hammingDistance: function (a, b){
    function nBits(n){
      var c;

      for (c = 0; n; c++) {
        n &= n - 1; // clear the least significant bit set
      }

      return c;
    }

    var d = a ^ b;

    return nBits(d);
  },
  /**
   * QRCodeDecode IMAGE FUNCTIONS
   */
  isDarkWithSize: function (x, y, moduleSize){
    return this.image.isDark(Math.round(this.imageLeft + x * moduleSize),
      Math.round(this.imageTop + y * moduleSize), Math.round(moduleSize));
  },
  isDark: function (x, y){
    return this.isDarkWithSize(x, y, this.moduleSize);
  },
  /**
   * QRCode decode constants
   */
  alphanum: [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    ' ',
    '$',
    '%',
    '*',
    '+',
    '-',
    '.',
    '/',
    ':'
  ]
};


export default QRDecode