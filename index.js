var vmCart = new Vue({
	el:"#app",
	data:{
		totalMoney:0,
		list:new Array(),
		isSelectAll:false,
		confirmDelete:false,
		readyToDelIndex:-1,
	},
	mounted:function(){
		var _this = this;
		this.$nextTick(function(){
			axios.get('http://localhost:8080/data/cartData.json')
			.then(
			// 使用箭头函数的话，this的作用域并不会变，还是指向vmCart
			// 	(retObj)=>{
			// 	if(retObj.status == 200){
			// 		this.totalMoney = retObj.data.result.totalMoney;
			// 		this.list = retObj.data.result.list;
			// 	}
			// }
			// 不使用箭头函数的场合
			// 如果要使用vmCart实例，
			// 就必须在mounted钩子函数里再调用一次$nextTick方法才能保证el被render在dom中
			function(retObj){
				if(retObj.status == 200){
					vmCart.list = retObj.data.result.list;
				}
			}
			)
			.catch(function(errorObj){
				console.log("get data error...");
			})
		});
	},
	methods:{
		pageInit:function(){
			console.log("page initing...")
		},
		partMouseOver:function(partObj){
			console.log("mouse over part...");
			if(partObj.showImg == void 0){
				this.$set(partObj,"showImg",true);	
			} else {
				partObj.showImg = true;
			}
		},
		partMouseOut:function(partObj){
			partObj.showImg = false;
		},
		selectGood:function(goodObj,index){
			if(goodObj.isChecked == void 0){
				this.$set(goodObj,"isChecked",true)
			} else {
				goodObj.isChecked = !goodObj.isChecked;
			}
			this.isCheckAll();
		},
		selectAll:function(){
			this.isSelectAll = true;
			this.list.forEach((good)=>{
				good.isChecked = true;
			});
		},
		unSelectAll:function(){
			this.isSelectAll = false;
			this.list.forEach((good)=>{
				good.isChecked = false;
			})
		},
		deleteSelectedGood:function(){
			// check是否至少选中一件商品
			var isSelectedGood = this.list.some(function(item){
				return item.isChecked;
			});
			// 如果没有选中则弹框警告
			if(!isSelectedGood){
				alert("请至少选择一件商品!");
			} else {
				// 使用传统写法
				// 遍历商品列表删除所有选中的
				this.list.forEach(function(item,index,_list){
					if(item.isChecked){
						_list.splice(index,1);
					}
				});
				// 使用箭头函数
				// this.list.forEach((item,index)=>{
				// 	if(item.isChecked){
				// 		this.list.splice(index,1);
				// 	}
				// });
			}
		},
		delGood:function(good,_index){
			this.confirmDelete = true;
			this.readyToDelIndex = _index;
		},
		cancelDel:function(){
			this.confirmDelete = false;
		},
		doDel:function(){
			this.list.splice(this.readyToDelIndex,1);
			this.confirmDelete=false;
		},
		changeQuentity:function(good,val,_index){
			if(good.productQuentity == 1 && val == -1 ){
				this.confirmDelete = true;
				this.readyToDelIndex = _index;
			} else {
				good.productQuentity += val;	
			}
		},
		isCheckAll:function(){
			var flag = true;
			this.list.forEach(function(good){
				if(!good.isChecked){
					flag = false;
				}
			});
			if(!flag){
				this.isSelectAll = false;
			} else {
				this.isSelectAll = true;
			}
		},
	},
	watch:{

	},
	computed:{
		totalPrice:function(){
			var total = 0;
			this.list.forEach(function(good){
				if(good.isChecked){
					total += good.productPrice * good.productQuentity;
				}
			});
			return total;
		},
	},
	filters:{
		Currency:function(val){
			return val + " 元";
		},
	}
});

