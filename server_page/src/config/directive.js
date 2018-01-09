import Vue from 'vue'
import $ from '../plugins/jQuery/jquery-2.2.3.min'

Vue.directive('check', {
  inserted (el, binding, vnode) {
    $(el).iCheck({
      checkboxClass: 'icheckbox_flat-green',
      radioClass: 'iradio_flat-green'
    }).on('ifChecked', () => {
      console.log(vnode)
      vnode.$emit(true)
      console.log(binding)
    }).on('ifUnchecked', () => {
      binding.expression = false
    })
  }
})
Vue.directive('select', {
  inserted (el) {
    $(el).select2({
      minimumResultsForSearch: Infinity
    }).on('select2:select', () => {
    })
  }
})

Vue.directive('table', {
  inserted (el) {
    $(el).append(
      `
<thead>
                    <tr role="row">
                      <th>
                        Rendering engine
                      </th>
                      <th>
                        Browser
                      </th>
                      <th>
                        Platform(s)
                      </th>
                      <th>
                        Engine version
                      </th>
                      <th>
                        CSS grade
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr role="row" class="odd">
                      <td class="sorting_1">Presto</td>
                      <td>Nintendo DS browser</td>
                      <td>Nintendo DS</td>
                      <td>8.5</td>
                      <td>C/A<sup>1</sup></td>
                    </tr>
                    <tr role="row" class="even">
                      <td class="sorting_1">Tasman</td>
                      <td>Internet Explorer 4.5</td>
                      <td>Mac OS 8-9</td>
                      <td>-</td>
                      <td>X</td>
                    </tr>
                    <tr role="row" class="odd">
                      <td class="sorting_1">Tasman</td>
                      <td>Internet Explorer 5.1</td>
                      <td>Mac OS 7.6-9</td>
                      <td>1</td>
                      <td>C</td>
                    </tr>
                    <tr role="row" class="even">
                      <td class="sorting_1">Tasman</td>
                      <td>Internet Explorer 5.2</td>
                      <td>Mac OS 8-X</td>
                      <td>1</td>
                      <td>C</td>
                    </tr>
                    <tr role="row" class="odd">
                      <td class="sorting_1">Trident</td>
                      <td>Internet
                        Explorer 4.0
                      </td>
                      <td>Win 95+</td>
                      <td> 4</td>
                      <td>X</td>
                    </tr>
                    <tr role="row" class="even">
                      <td class="sorting_1">Trident</td>
                      <td>Internet
                        Explorer 5.0
                      </td>
                      <td>Win 95+</td>
                      <td>5</td>
                      <td>C</td>
                    </tr>
                    <tr role="row" class="odd">
                      <td class="sorting_1">Trident</td>
                      <td>Internet
                        Explorer 5.5
                      </td>
                      <td>Win 95+</td>
                      <td>5.5</td>
                      <td>A</td>
                    </tr>
                    <tr role="row" class="even">
                      <td class="sorting_1">Trident</td>
                      <td>Internet
                        Explorer 6
                      </td>
                      <td>Win 98+</td>
                      <td>6</td>
                      <td>A</td>
                    </tr>
                    <tr role="row" class="odd">
                      <td class="sorting_1">Trident</td>
                      <td>Internet Explorer 7</td>
                      <td>Win XP SP2+</td>
                      <td>7</td>
                      <td>A</td>
                    </tr>
                    <tr role="row" class="even">
                      <td class="sorting_1">Trident</td>
                      <td>AOL browser (AOL desktop)</td>
                      <td>Win XP</td>
                      <td>6</td>
                      <td>A</td>
                    </tr>
                    </tbody>
`
    )
  }
})
