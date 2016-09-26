/**
 * Author © 2016 Sulaeman <me@sulaeman.com>. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { notify } from '../Util';
import { getAreas } from '../../actions/actions';
import Item from './Item';

class List extends Component {

  static propTypes = {
    baseUrl: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
    getAreas: PropTypes.func.isRequired,
    dataIsLoaded: PropTypes.func, 
    loadedData: PropTypes.func
  };

  constructor() {
    super();

    this.state = this.getDefaultState();

    this.isDataLoaded = false;
    this.timeout = null;
    this.fetchInterval = 60000; //60000
    this.previousFilter = null;
  }

  componentDidMount() {
    if (this.state.data == null) {
      this.collectData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.data.action != "undefined") {
      if (!nextProps.data.action.started) {
        if (nextProps.data.action.error) {
          notify('error', nextProps.data.action.errorMessage, 'Error');
        } else {
          if (typeof nextProps.data.data != "undefined") {
            if ( ! this.isDataLoaded && this.props.dataIsLoaded) {
              this.isDataLoaded = true;
              this.props.dataIsLoaded();
            }

            if (this.props.loadedData && !_.isMatch(this.state.data, nextProps.data.data)) {
              this.props.loadedData(nextProps.data.data);
            }

            this.setState({data: nextProps.data.data});
          }
        }

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.collectData();
        }, this.fetchInterval);
      }
    }
  }

  componentDidUpdate() {
    if (!_.isMatch(this.previousFilter, this.props.filter)) {
      this.previousFilter = _.clone(this.props.filter);
      this.isDataLoaded = false;
      this.collectData();
    }
  }

  getDefaultState() {
    return {
      data: null,
      openDetailData: null
    };
  }

  render() {
    if (this.state.data == null) {
      return null;
    }

    const items = this.state.data.map((item) => {
      return <Item key={`area-item-${item.id}`}
       baseUrl={this.props.baseUrl} data={item}
       openDetail={this.handleOpenDetail.bind(this)} />;
    });

    return (
      <div className="search-content-3">
        <div className="row">{items}</div>
      </div>
    );
  }

  handleOpenDetail(data) {
    this.setState({openDetailData: data});
  }

  handleCloseDetail() {
    this.setState({openDetailData: null});
  }

  getDetailData() {
    if (this.state.openDetailData == null) {
      return null;
    }

    return <Detail baseUrl={this.props.baseUrl}
     data={this.state.openDetailData}
      onClose={this.handleCloseDetail.bind(this)} />
  }

  collectData() {
    clearTimeout(this.timeout);

    this.props.getAreas(_.extend({
      limit: 0, 
      include: 'district,village,photos'
    }, this.props.filter));
  }

}

const mapStateToProps = (state) => {
  return {
    data: state.areas
  }
};

const mapDispatchToProps = {
  getAreas
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
