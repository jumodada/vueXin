<template>
<div class="x-pagination" v-show="ifOnePage">
    <div class="x-pagination-button"
         @click="changeCurrentPage(currentPage-1)"
         :class="{disabled:currentPage===1}">

        <f-icon class="x-pagination-li-icon" name="left" color="#707070">

        </f-icon>
    </div>
            <ul class="x-pagination-ul">
                <li
                        v-for="(page,index) in pages"
                        @mouseenter="toggleIcon(page,$event,index)"
                        @mouseleave="toggleIcon(page,$event,index)"
                        @click="changeCurrentPage(page,index)"
                class="x-pagination-li"
                :class="{active:page===currentPage,separator:(page==='...')}">
                    <span v-if="(typeof page==='number')">{{page}}</span>
                    <transition name="fade" mode="out-in">
                        <Dots key="dynamic" v-if="page==='...'&&index===activeIcon" class="x-pagination-li-icon"></Dots>
                        <f-icon  key="static" class="x-pagination-li-icon" color="#8a8a8a" v-if="page==='...'&&index!==activeIcon" name="more"></f-icon>
                    </transition>
                </li>
            </ul>
    <div class="x-pagination-button"
         @click="changeCurrentPage(currentPage+1)"
         :class="{disabled:currentPage===totalPage}" style="margin-left: 5px">
        <f-icon  class="x-pagination-li-icon" name="right" color="#707070">
        </f-icon>
    </div>
</div>
</template>

<script>

    import Dots from '../../dynamic icon/dots'
    import Icon from '../../icon/src/icon'
    export default {
        name: "x-pagination",
        components:{
          'f-icon':Icon,
            Dots
        },
        props:{
            totalPage:{
                type:Number,
                required:true
            },
            currentPage:{
                type:Number,
                required:true
            },
            onePageNumber:{
                type:Number,
                required:true
            },
            disabled:{
                type:Boolean,
                default:false
            },
            hideIfOnePage:{
                type:Boolean,
                default:true
            },
            onChange:{
                type:Function,
                default:null
            },
            pagerCount:{
                type:Number,
                default:5,
                validator(val){
                    return val < 5 || val > 18 ? false : true;
                }
            }
        },
        data(){
            return {
                activeIcon:null
            }
        },
        beforeDestroy(){
          this.$el.remove()
        },
       computed:{
            ifOnePage(){
                if(!this.hideIfOnePage)return true
                if(this.totalPage>1)return true
                return false
            },
           currentArray(){
                let arr = [1,this.totalPage]
               let halfCount = Math.floor(this.pagerCount/2)
               let [j,k]=[1,1]
               let currentPage=this.currentPage
               for(let i=0;i<=halfCount;i++){
                   if(this.currentPage-i<=1){
                       arr.push(currentPage+j+halfCount)
                       j++
                   }else{
                       arr.push(currentPage-i)
                   }
                   if(this.currentPage+i>=this.totalPage){
                       arr.push(currentPage-k-halfCount)
                       k++
                   }else{
                       arr.push(currentPage+i)
                   }
               }

             return arr
           },
         pages(){
            return unique(this.currentArray
                 .filter(n=>n>=1&&n<=this.totalPage)
                 .sort((a,b)=>a-b))
                 .reduce((prev,current,index,array)=>{
                     prev.push(current)
                     array[index+1]!==undefined&&array[index+1]-array[index]>1&&prev.push('...')
                     return prev
                 },[])
         }
       },
        methods:{
            toggleIcon(page,e,index){
                if(typeof page==='number')return
                this.activeIcon = e.type === 'mouseenter' ? index : null;

            },
            changeCurrentPage(page,index){
                if(page<=0||page>this.totalPage)return
                if(typeof page==='number'){
                    this.$emit('update:currentPage',page)
                }else{
                    let currentPage = this.currentPage
                    let direction,number,differ
                    direction = index < this.pages.length / 2 ? 'left' : 'right';
                    differ = direction === 'left' ? currentPage : this.totalPage - currentPage
                    number = differ > 9 ? 'more' : 'less';
                    let distance = {
                        left:{
                          less:currentPage - 3 ,
                          more:currentPage - 5
                        },
                        right:{
                            less:currentPage + 3 ,
                            more:currentPage + 5
                        }
                    }
                    this.$emit('update:currentPage',distance[direction][number])
                    this.activeIcon = null
                }
                this.onChange()
            }
        }

    }
    function unique(array) {
        const object = {}
        array.map(number=>{
            object[number] = true
        })
        return Object.keys(object).map(s=>parseInt(s,10))
    }
</script>

<style scoped lang="scss">
    .fade-enter-active, .fade-leave-active {
        transition: all .15s;
    }
    .fade-enter, .fade-leave-to{
        opacity: 0;
    }
            .x-pagination{
                display: inline-flex;
                justify-content: flex-start;
                align-items: center;
                &-button{
                    position: relative;
                    top: .5px;
                    border:1px solid #cdcdcd;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    width: 20px;
                    height: 27px;
                    padding: 4px 6px 4px;
                    outline: none;
                    border-radius: 3px;
                    cursor: pointer;
                    &.disabled{
                        cursor: not-allowed;
                        opacity: .5;
                    }
                }
                        &-ul{
                            padding-left: 0;
                        }
                   &-li{
                       display: inline-flex;
                       align-items: center;
                       justify-content: center;
                       vertical-align: center;
                       padding: 4px 6px;
                       margin-left: 5px;
                       min-width: 20px;
                       min-height: 25px;
                       border:1px solid #cdcdcd;
                       border-radius: 3px;
                       color: rgb(96, 98, 102);
                       cursor: pointer;
                       transition: .3s all  ease;
                       &:hover{
                           color: #409eff;
                       }
                       &.separator{
                           position: relative;
                           top: 5px;
                           border:none;
                           font-size: 16px;
                       }
                       &.active{
                           border:1px solid #409eff;
                           cursor: default;
                       }
                       &-icon{
                           width: 1.1em;
                           height: 1.1em;
                       }
               }

            }
</style>

