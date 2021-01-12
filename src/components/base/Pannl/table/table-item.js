// 根据不同的type 渲染不同的item
const render = {
  'normal': function(h, { prop, filter }, row) {
    // 是否有filter 函数
    const hasFilter = filter || false
    const value = hasFilter ? hasFilter(row[prop]) : row[prop]
    return <span>{value}</span>
  },
  'render': function(h, op, row) {
    const { render } = op
    return render(h, op, row)
  },
  'btns': function(h, { btns = [] }, row) {
    const hasBtns = btns && btns.length !== 0
    return hasBtns ? (
      btns.map(it => {
        const { type, size, icon } = it
        return <el-button type={type} size={size} icon={icon} onClick={it.events.click.bind(null, row)}>{ it.text }</el-button>
      })
    ) : null
  },
  'input': function(h, op, row) {
    return (
      <el-input
        clearable
        placeHolder={op.placeHolder}
        value={row[op.prop]}
        on-input={val => {
          if (val.startsWith(' ')) {
            row[op.prop] = ''
          } else {
            row[op.prop] = val
          }
        }}
      ></el-input>
    )
  }
}
export default {
  functional: true,
  render(h, ctx) {
    const { props: { op, row }} = ctx
    const { type } = op
    return render[type](h, op, row)
  }
}
