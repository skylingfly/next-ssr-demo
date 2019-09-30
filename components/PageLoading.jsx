import { Spin } from 'antd'

export default () => (
  <div className="root">
    <Spin tip="Loading ..."/>
    <style jsx>{`
      .root {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, .3);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
      }

    `}</style>
  </div>
)