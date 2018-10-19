import React, { Component } from 'react'
import CodeEditor from 'react-simple-code-editor'
import cn from '../../utils/cn'
import prism from '../../utils/prism'

const style = {
  position: 'absolute',
  top: 0,
  right: 0,
  color: 'white',
  padding: '5px 10px'
}

class Editor extends Component {
  static defaultProps = {
    language: 'jsx',
  }

  state = {
    code: this.props.code,
  }

  handleKeyDown = event => {
    const { key } = event

    if (this.state.ignoreTab && key !== 'Tab' && key !== 'Shift') {
      if (key === 'Enter') {
        event.preventDefault()
        event.stopPropagation()
      }
      this.setState({ ignoreTab: false })
    }
    if (!this.state.ignoreTab && key === 'Escape') {
      this.setState({ ignoreTab: true })
    }
  }

  handleFocus = e => {
    this.setState({
      ignoreTab: !this.mouseDown,
      keyboardFocused: !this.mouseDown,
    })
  }

  handleMouseDown = () => {
    this.mouseDown = true
    window.setTimeout(() => {
      this.mouseDown = false
    }, 0)
  }

  handleValueChange = code => {
    this.setState({ code })

    if (this.props.onChange) {
      this.props.onChange(code)
    }
  }

  renderMessage() {
    const { renderTabMessage } = this.props
    const { ignoreTab } = this.state
    if (renderTabMessage)
      return renderTabMessage(ignoreTab, { id: this.id, 'aria-live': 'polite' })

    return (
      <div id={this.id} aria-live="polite" style={style}>
        {ignoreTab ? (
          <React.Fragment>
            Press <kbd>enter</kbd> or type a key to enable tab-to-indent
          </React.Fragment>
        ) : (
          <React.Fragment>
            Press <kbd>esc</kbd> to disable tab trapping
          </React.Fragment>
        )}
      </div>
    )
  }

  render() {
    const {
      contentEditable,
      className,
      code,
      language,
      onChange,
      ...rest
    } = this.props
    const { keyboardFocused, ignoreTab } = this.state

    return (
      <div
        onKeyDownCapture={this.handleKeyDown}
        onMouseDown={this.handleMouseDown}
        style={{ position: 'relative' }}
      >
        <CodeEditor
          value={this.state.code}
          ignoreTabKey={ignoreTab}
          onFocus={this.handleFocus}
          onValueChange={this.handleValueChange}
          className={cn('prism-code', className)}
          highlight={value => prism(value, language)}
          padding=".5rem"
          {...rest}
        />
        {(keyboardFocused || !ignoreTab) && this.renderMessage()}
      </div>
    )
  }
}

export default Editor
