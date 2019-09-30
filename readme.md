## SSR by nextjs && koa
1. next.js only for middleware;
2. koa for backend services and data resources;
3. styled css in jsx(dynamic && scoped jsx && global in different life cycle)
4. styled-components
5. Lazy-loading(- lazy component -lazy module) 动态引入 import('moment').default
6. ssr 同构, flow=> 浏览器/pages请求-> koa(服务端处理，并调用next.js)-> next.js 渲染 ->调用app getInitialProps -> current page getInitialProps ->最终渲染html -> 返回浏览器渲染 -> end
客服端： 点击连接按钮 ->异步加载页面组件js -> current page getInitialProps -> 数据返回，路由变化 -> 渲染新页面 -> end
7. hooks (函数组件具备类组件能力) useState useEffect useReducer
```js
setCount(value)
setCount(v => v + xx) //闭包陷阱 this.setState(v => v.count + 1)

function countReducer(state, action) {
  const rududerMap = {
    'add':state + 1,
    'minus': state -1,
  }
  return rududerMap[action.type] || state
}

const [count, dispatchCount] = useReducer(countReducer, 0) //初始值

 useEffect(() => {
    const interval = setInterval(()=> {
      dispatchCount({type: 'add'})
    },1000)

    return () => clearInterval(interval) //卸载
  }, [count]) //根据属性依赖判断是否重新执行useEffect【】

  // 渲染dom之前执行
  useLayoutEffect(
    ()=> {
      console.log('Lay invoked')
      return () => {
        console.log('Lay disappear')
      }
    },[name]
  )

  export default React.createContext('')
  const context = useContext(MyContext)

  const inputRef = useRef()

  // 优化 hook
  // useMemo， useCallback 配合 memo shouldComponentUpdate避免不必要的刷新

  const config = useMemo(()=> (
    {
      text: `count is ${count}`,
      color: count> 3 ? 'red': 'blue'
    }
  ),[count])

  const handleBtn = useCallback(() => dispatchCount({ type: 'add' }), [])

  // useRef 返回同一个对象去规避 闭包陷阱 方法组件每次都生成新的数据方法
  const countref = useRef()
  countref.current = count
  // 不算bug  看使用场景
```
8. redux 公共数据共享 redux-thunk 做中间件 react-redux 连接
9. container组件扩展style =>cloneElment(Comp) (应用 HOC => 会造成dom多余? <></>)
10. HOC 扩展功能 next.js reudx同构  官方包：next-redux-wrapper
11. OAuth - 授权 token权限 refreshtoken/ OAuthcode
12. 全局loading route change 触发
13. 同构 request 客户端/github开头 服务端 中间件拦截， 服务端直接请求即可
14. 数据缓存解决方案？变量存储全局作用域index，服务端渲染初始化 
15. 优化 
```js 
1. 点击显示文本 不可点击 2. js router push => Alink  seo优化
selected ? <span>{item.name}</span> :<FilterLink  {...querys} name={item.name} sort={item.value} order={item.order}/>
2. 减少不必要的安装包  wepack优化 moment
3. dynamic 动态import组件

```
16. HOC 组件抽离 基础组件
17. atob() 方法用于解码使用 base-64 编码的字符串。
18. https://www.gatsbyjs.org/ for cms


#### Problems:

1. Text content did not match. Server: "10" Client: "5", 服务端的状态和客户端的状态不一致

> 原因: 服务器会缓存`store`中state， 每次刷新活者是多客户端浏览请求服务器，获取的页面数据不同

Ways: 
- APP每次请求服务端的时候（页面初次进入，页面刷新！切记生命周期），store 重新创建。
- 前端路由跳转的时候，App.getInitalProps,都会执行 store 单例模式。
- 因为是同构,在getInitalProps 获取的是数据 然后回传给组件中，因此组件中要单独创建store

2. Search 页面 github最多显示1000个
3. GET /repos/:owner/:repo/labels
--> 去掉headers 否则 403

#### tool
```js
1. function b64toutf8(bstr){
  return decodeURIComponent(escape(atob(bstr)))
}

2. function makeQuery(queryObj) { //查询字符串对象拼接
  const query = Object.entries(queryObj)
    .reduce((pre, entry) => {
      pre.push(entry.join('='))
      return pre
    },[]).join('&')
  return query
}

3. isValidElement react判断是否为组件
4. markdownit for render markdown
5. lru cache 数据缓存
6. debounce 防抖
```

#### 项目结构：
```
.
├── LICENSE
├── components
│   ├── Comp.js
│   ├── Layout.jsx
│   ├── PageLoading.jsx
│   ├── Repo.jsx
│   ├── SearchUser.jsx
│   ├── container.jsx
│   ├── repo-basic.jsx
│   └── with-markdown.jsx
├── config.js
├── lib
│   ├── MyContext.js
│   ├── repo-basic-cache.js
│   ├── request.js
│   ├── util.js
│   └── with-redux.js
├── next.config.js
├── package-lock.json
├── package.json
├── pages
│   ├── _app.js
│   ├── detail
│   │   ├── index.js
│   │   └── issues.js
│   ├── index.js
│   └── search.js
├── readme.md
├── server
│   ├── api.js
│   ├── auth.js
│   └── session-store.js
├── server.js
├── store
│   ├── actions
│   │   └── user.js
│   ├── constants
│   │   └── user.js
│   ├── reducers
│   │   ├── index.js
│   │   └── user.js
│   └── store.js
```