import React, { useState } from 'react'
// import '@/app.less'
import(
  /* webpackChunkName: "my-chunk-name" */ // 资源打包后的文件chunkname
  /* webpackPrefetch: true */ // 开启prefetch预获取
  /* webpackPreload: true */ // 开启preload预获取
  '@/app.less'
);
//webpack v4.6.0+ 增加了对预获取和预加载的支持,使用方式也比较简单,在import引入动态资源时使用webpack的魔法注释




function App() {
  const [count, setCount] = useState('')
  const onChange = (e) => {
    setCount(e.target.value)
    console.log(count);
    
  }
  return (
    <div>
      <h2>webpack</h2>
      <p>受控组件</p>
      <input type="text" value={count} onChange={onChange} />
      <p>非受控组件</p>
      <input type="text" />
    </div>
  )
}
export default App
