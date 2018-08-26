;(function () {
	
	
	Vue.directive('focus',{
		inserted:function(el){
			el.focus()
		}
	})
	
	Vue.directive('todo-focus',{
		update(el,binding){
			if(binding.value){
				el.focus()
			}
		}
	})

	window.app=new Vue({
		data:{
			todos:JSON.parse(window.localStorage.getItem('todos')||'[]'),
			todoText:'',
			currentEditing:null,
			filltext:''
		},
		//计算属性   是方法   但是不能用方法调用    就是不能加括号
		//缓存计算的结果    节约性能
		computed: {
			remaningCount() {
				return this.todos.filter(t=>!t.completed).length
			},
			//法一
//			toggleAllSat() {
//				return this.todos.every(t=>t.completed)
//			}

			toggleAllSat: {
				get (){
					return this.todos.every(t=>t.completed)
				},
				set () {
				const check=!this.toggleAllSat
				this.todos.forEach(item => {
				item.completed=check
			})
				}
			},
			filterTodos () {
				
				switch(this.filltext){
					case 'active':
					    return this.todos.filter(t=>!t.completed)
						break
					case 'completed':
						return this.todos.filter(t=>t.completed)
						break
					default:
						return this.todos
						break
				}
			}
		},
		watch : {
			todos: {
				handler(){
					window.localStorage.setItem('todos',JSON.stringify(this.todos))
				},
				deep:true
				
			}
		},
		methods:{
			handlekeydown(e){
			const target=e.target	
			const value=e.target.value.trim()
			if(!value.length){
				return
			}
			const todos=this.todos
			todos.push({
				id:todos.length>0?todos[todos.length-1].id+1:1,
				title:value,
				completed:false
			})
			target.value=''
			}
		,
//		handleToggleAllChange(e){
//			const check=e.target.checked
//			this.todos.forEach(item => {
//				item.completed=check
//			})
//		},
		//传参后无法拿到e
		handleRemove(index){
			this.todos.splice(index,1)
		},
		handleediting(todo){
			this.currentEditing=todo
		},
		handleEnterSave (todos,index,e) {
			const target=e.target
			const value=target.value.trim()
			if(!value.length){
				this.todos.splice(index,1)
			}else{
				todos.title=value
				this.currentEditing=null
			}
			
		},
		handleCanceEsc () {
			this.currentEditing=null
		},
		handleClearCompleted (){
			//方法一
			for(let i=0;i<this.todos.length;i++){
				if(this.todos[i].completed){
					this.todos.splice(i,1)
					i--
				}
			}
			//方法二
//			this.todos=this.todos.filter(t=>!t.completed)
		}}
	}).$mount('#app')
	
	handlehashchange()
	window.onhashchange=handlehashchange
	function handlehashchange(){
		
		app.filltext=window.location.hash.substr(2)
		console.log(app.filltext)
	}
})();
