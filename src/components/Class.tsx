import React, { PureComponent } from 'react'

function addAge(Target:Function) {
  Target.prototype.age = 18
}

//现在react主流开发都是函数组件和react-hooks,但有时也会用类组件,可以用装饰器简化代码。
@addAge
class Class extends PureComponent {
  age?: number
  render() {
    return (
        <div>
            我是类组建--{this.age}
        </div>
    )
  }
}
export default Class