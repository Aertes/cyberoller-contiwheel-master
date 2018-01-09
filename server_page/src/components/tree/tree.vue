<template>
  <div>
    <div>
      <ul class="s-tree">
        <li v-for="tree of treeData">
          <div class="clearfix s-tree-row">
            <i class="fa fa-angle-down pull-left"
               @click="openChild(tree, $event)"
               v-if="tree.child && tree.child.length"
               :style="{transform: openList[tree[treeId]] ? '' : 'rotateZ(-90deg)'}"></i>
            <div @click="treeClick(tree, $event)" class="s-tree-title"
                 @dblclick="openChild(tree, $event)"
                 :class="{active: chooseR && chooseR[treeId] === tree[treeId]}">
              {{tree[name]}}
            </div>
          </div>
          <a-fade-in-down>
            <div v-if="openList[tree[treeId]]" class="s-tree-child">
              <s-tree v-if="tree.child && tree.child.length"
                      :data="tree.child"
                      :treeId="treeId"
                      :name="name"
                      @treeClick="treeClick(arguments[0])"
                      :cRow="chooseR"></s-tree>
            </div>
          </a-fade-in-down>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import velocity from 'velocity-animate'

  export default {
    props: ['data', 'title', 'treeId', 'name', 'cRow'],
    created () {
//      console.log(this.data)
    },
    data () {
      return {
        openList: {},
        chooseRow: null
      }
    },
    computed: {
      chooseR () {
        if (this.title) {
          return this.chooseRow
        }
        return this.cRow
      },
      treeData () {
        if (!this.title) {
          this.data.forEach(row => {
            this.$set(this.openList, row[this.treeId], true)
          })
          return this.data
        }
        let dataMap = {}
        this.data.forEach(row => {
          dataMap[row[this.treeId]] = row
        })
        let treeModel = {
          [this.name]: this.title,
          [this.treeId]: -1,
          child: []
        }
        for (let key of Object.keys(dataMap)) {
          let parId = dataMap[key].parent_id
          if (parId && dataMap[parId]) {
            dataMap[parId].child = dataMap[parId].child || []
            dataMap[parId].child.push(dataMap[key])
          } else {
            treeModel = dataMap[key]
            this.$set(this.openList, dataMap[key][this.treeId], true)
//            dataMap[key].parent_id = -1
//            treeModel.child.push(dataMap[key])
          }
        }
        return [treeModel]
      }
    },
    methods: {
      treeClick (tree) {
        if (this.title) {
          this.chooseRow = tree
        }
        this.$emit('input', tree)
        this.$emit('treeClick', tree)
      },
      openChild (tree, { target }) {
        if (target.targetName !== 'i') {
          target = target.previousElementSibling
        }
        let id = tree[this.treeId]
        if (!this.openList[id]) {
          velocity(target, {
            rotateZ: '-90deg'
          }, { duration: 0 })
        }
        this.openList[id] = !this.openList[id]
        velocity(target, {
          rotateZ: this.openList[id] ? '0deg' : '-90deg'
        }, { duration: 200 })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .s-tree ul {
    margin-left: 20px;
    color: #777777;
  }

  .fa + .s-tree-title {
    padding-left: 5px;
  }

  .s-tree-title {
    padding-left: 19px;
    float: left;
  }

  .s-tree-row {
    cursor: pointer;
    margin: 5px 0;
    .fa {
      margin-top: 2px;
      color: #777777;
    }
    .fa:hover {
      color: #000;
    }
    .active {
      color: #00a7d0;
    }
  }

  .s-tree-row:hover {
    color: #000;
  }

  .close_tree {
    transform: rotateZ(-90deg);
  }

  .s-tree-child {
    overflow: hidden;
  }
</style>