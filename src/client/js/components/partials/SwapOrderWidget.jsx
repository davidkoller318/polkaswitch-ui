import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import _ from "underscore";

import TokenIconImg from './TokenIconImg';
import TokenSearchBar from './TokenSearchBar';

export default class SwapOrderWidget extends Component {
  constructor(props) {
    super(props);

    this.box = React.createRef();

    var findTokenById = function(tid) {
      return _.find(window.tokens, function(v) {
        return v.id == tid || v.symbol == tid;
      });
    };

    this.state = {
      // RSR
      // to: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
      // DAI
      to: findTokenById("0x6B175474E89094C44Da98b954EedeAC495271d0F"),
      // ETH
      from: findTokenById("ETH"),

      searchTarget: "",
      showSettings: false,
      showConfirm: false,
      showSearch: false
    };

    this.onSwapTokens = this.onSwapTokens.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.handleSearchToggle = this.handleSearchToggle.bind(this);
    this.handleSettingsToggle = this.handleSettingsToggle.bind(this);
    this.handleReview = this.handleReview.bind(this);
    this.triggerHeightResize = this.triggerHeightResize.bind(this);
    this.updateBoxHeight = _.debounce(this.updateBoxHeight.bind(this), 20);
  }

  componentDidUnmount() {
    window.removeEventListener('resize', this.updateBoxHeight);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateBoxHeight);
    this.updateBoxHeight();
  }

  updateBoxHeight() {
    this.box.current.style.height = "";
    _.defer(function() {
      this.box.current.style.height = `${this.box.current.offsetHeight}px`;
    }.bind(this))
  }

  triggerHeightResize(node, isAppearing) {
    this.box.current.style.height = `${node.offsetHeight}px`;
  }

  onSwapTokens(e) {
    this.setState({
      to: this.state.from,
      from: this.state.to
    });
  }

  handleSearchToggle(target) {
    return function(e) {
      this.setState({
        searchTarget: target,
        showSearch: !this.state.showSearch
      });
    }.bind(this);
  }

  handleSettingsToggle(e) {
    this.setState({
      showSettings: !this.state.showSettings
    });
  }

  handleReview(e) {
    // TODO validate form swap

    this.setState({
      showConfirm: !this.state.showConfirm
    });
  }

  handleTokenChange(token) {
    var _s = { showSearch: false };
    _s[this.state.searchTarget] = token;
    this.setState(_s);
  }

  renderToken(token) {
    if (!token) {
      return (<div />);
    }

    return (
      <>
      <div className="level-item">
        <TokenIconImg
          size={"35"}
          token={token} />
      </div>
      <div className="level-item">
        <div className="is-size-3"><b>{token.symbol}</b></div>
      </div>
      </>
    )
  }

  renderTokenInput(target, token) {
    if (!token) {
      return (<div />);
    }
    return (
      <div className="level is-mobile">
        <div className="level is-mobile my-0 token-dropdown"
          onClick={this.handleSearchToggle(target)}>
          {this.renderToken(token)}
          <div className="level-item">
            <i className="fas fa-angle-down"></i>
          </div>
        </div>
        <div className="level-item is-flex-grow-1 is-flex-shrink-1 is-flex-direction-column is-align-items-flex-end">
          <div className="field" style={{ width: "100%", maxWidth: "200px" }}>
            <div className="control" style={{ width: "100%" }}>
              <input className="input is-medium" placeholder="0.0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderOrderView() {
    return (
      <div className="page">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left is-flex-grow-1">
              <div className="level-item is-narrow">
                <div className="buttons has-addons">
                  <button className="button is-link is-outlined is-selected px-6">Market</button>
                  <button className="button px-6">Limit</button>
                </div>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <span className="icon clickable is-medium" onClick={this.handleSettingsToggle}>
                  <i className="fas fa-sliders-h"></i>
                </span>
              </div>
            </div>
          </div>

          <div className="notification is-white my-0">
            <div className="text-gray-stylized">
              <span>You Pay</span>
            </div>
            {this.renderTokenInput("from", this.state.from)}
          </div>

          <div class="swap-icon-wrapper">
            <div class="swap-icon" onClick={this.onSwapTokens}>
              <i class="fas fa-long-arrow-alt-up"></i>
              <i class="fas fa-long-arrow-alt-down"></i>
            </div>
          </div>

          <div className="notification is-info is-light">
            <div className="text-gray-stylized">
              <span>You Recieve</span>
            </div>
            {this.renderTokenInput("to", this.state.to)}
          </div>

          <div>
            <button className="button is-danger is-fullwidth is-medium" onClick={this.handleReview}>
              Review Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderConfirmView() {
    return (
      <div className="page page-stack">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <span className="icon clickable is-medium" onClick={this.handleReview}>
                  <i className="fas fa-arrow-left"></i>
                </span>
              </div>
              <div className="level-item">
                <b className="widget-title">Review Order</b>
              </div>
            </div>
          </div>

          <hr />

          <div className="text-gray-stylized">
            <span>You Pay</span>
          </div>

          <div className="level is-mobile">
            <div className="level-left">
              {this.renderToken(this.state.from)}
            </div>

            <div className="level-right">
              <div className="level-item currency-text is-size-3">
                1.0
              </div>
            </div>
          </div>

          <hr />

          <div className="text-gray-stylized">
            <span>You Recieve</span>
          </div>

          <div className="level is-mobile">
            <div className="level-left">
              {this.renderToken(this.state.to)}
            </div>

            <div className="level-right">
              <div className="level-item currency-text is-size-3">
                0.00000324
              </div>
            </div>
          </div>

          <hr />

          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <b>Gas Price</b>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item currency-text">
                0.00000324 ETH
              </div>
            </div>
          </div>

          <hr />

          <div>
            <button className="button is-danger is-fullwidth is-medium"
              onClick={this.handleReview}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderSettingsView() {
    return (
      <div className="page page-stack">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <span className="icon clickable is-medium" onClick={this.handleSettingsToggle}>
                  <i className="fas fa-arrow-left"></i>
                </span>
              </div>
              <div className="level-item">
                <b className="widget-title">Advanced Settings</b>
              </div>
            </div>
          </div>

          <hr />

          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <b>Gas Price</b>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <div className="select">
                  <select>
                    <option>Instant</option>
                    <option>Cheapest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTokenSearch() {
    return (
      <div className="page page-stack">
        <div className="page-inner">
          <TokenSearchBar
            inline={true}
            focused={this.state.showSearch}
            placeholder={"Try DAI, LINK or Ethereum ... "}
            handleClose={this.handleSearchToggle("to")}
            handleTokenChange={this.handleTokenChange} />
        </div>
      </div>
    );
  }

  render() {
    var animTiming = 300;
    var isStack = !(
      this.state.showSettings ||
      this.state.showConfirm ||
      this.state.showSearch
    );

    return (
      <div ref={this.box} className="box swap-widget">
        <CSSTransition
          in={isStack}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="fade">
          {this.renderOrderView()}
        </CSSTransition>
        <CSSTransition
          in={this.state.showSearch}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          {this.renderTokenSearch()}
        </CSSTransition>
        <CSSTransition
          in={this.state.showSettings}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          {this.renderSettingsView()}
        </CSSTransition>
        <CSSTransition
          in={this.state.showConfirm}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          {this.renderConfirmView()}
        </CSSTransition>
      </div>
    );
  }
}

