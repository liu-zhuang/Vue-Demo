var vmAddress = new Vue({
	el:'.container',
	data:{
		addressList:new Array(),
		shippingMethod:1,
		limitNum:3,
		addressIndex:0,
		currentDefaultAddress:{},
	},
	mounted:function(){
		this.$nextTick(function(){
			axios.get('http://localhost:8080/data/address.json')
			.then(retObj=>{
				if(retObj.status == 200){
					this.addressList = retObj.data.result;
					this.addressList.forEach(address=>{
						if(address.isDefault){
							this.currentDefaultAddress = address;
						}
					});
				}
			})
		});
	},
	methods:{
		setDefaultAddress:function(address){
			this.currentDefaultAddress = address;
			address.isDefault = true;
		},
	},
	computed:{
		filteAddress:function(){
			return this.addressList.slice(0,this.limitNum);
		},
	},
	watch:{
		currentDefaultAddress:function(newVal,oldVal){
			oldVal.isDefault = false;
		},
	}
});