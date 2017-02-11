var vmCart = new Vue({
	el:"#app",
	data:{
		totalMoney:0,
		list:new Array(),
		currentIndex:0,
		isSelectAll:false
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
					vmCart.totalMoney = retObj.data.result.totalMoney;
					vmCart.list = retObj.data.result.list;
				}
			}
			)
			.catch(function(errorObj){
				
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
			}
			goodObj.isChecked = true; 
			this.currentIndex = index;
			if(this.isSelectAll){
				this.isSelectAll = false;
			}

		},
		selectAll:function(){
			this.isSelectAll = true;
			this.list.forEach((good)=>{
				good.isChecked = true;
			});
			this.currentIndex = -1;
		},
		unSelectAll:function(){
			this.isSelectAll = false;
		},

	},
	watch:{
		currentIndex:function(newVal,oldVal){
			debugger;
			if(newVal != -1){
				if(!this.isSelectAll && oldVal != -1){
					this.list[oldVal].isChecked = false;	
				} else {
					this.list.forEach(function(good,index){
						if(index != newVal){
							good.isChecked = false;
						}
					})
				}
			}			
		}
	}
});

