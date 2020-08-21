import { Component } from 'react';
import chroma from 'chroma-js';
import PropTypes from 'prop-types';

export default class MovingAverage extends Component {
  static processData(options) {
    const { data, buckets, window, suffix, excludeOriginal } = options;
    const newData = [];
    if (data) {
      data.forEach(series => {
        // Specify the size of the moving average window in buckets or % or default to  5%
        const windowPerc = window || this.defaultWindowPercent;
        let windowSize = series.data.length * (windowPerc / 100); // window is a percentage of range
        if (buckets) {
          windowSize = buckets; // window is specified
        }

        const movingWindow = []; // the moving window over which the average is calculated
        const newSeriesData = series.data.map(dataPoint => {
          const fieldName = series.metadata.groups[0].value;
          movingWindow.push(dataPoint[fieldName]);

          if (movingWindow.length > windowSize) {
            movingWindow.shift(); // removes the first element from an array
          }
          const mean =
            movingWindow.reduce((a, b) => a + b, 0) / movingWindow.length;

          const newDataPoint = { ...dataPoint };
          newDataPoint[fieldName] = mean;
          newDataPoint.y = mean;

          return newDataPoint;
        });

        const newSeries = {
          metadata: { ...series.metadata },
          data: newSeriesData
        };
        newSeries.metadata.name +=
          suffix != null ? ` ${suffix}` : this.defaultLabelSuffix;
        newSeries.metadata.id += '-mvgavg';

        // include or drop the original data?
        if (!excludeOriginal) {
          newData.push(series);
          newSeries.metadata.color = chroma(newSeries.metadata.color)
            .darken(1)
            .saturate(2)
            .hex(); // change colour of average series a bit
        }

        newData.push(newSeries);
      });

      return newData;
    } else {
      return null;
    }
  }

  static propTypes = {
    data: PropTypes.array, // Data in chart data format
    window: PropTypes.number, // Size of moving average window as a % of total chart time frame, default 5%
    buckets: PropTypes.number, // Size of moving average window in buckets (overrides above if present)
    suffix: PropTypes.string, // Suffix to add to series label (can be empty string), default '(moving average)'
    excludeOriginal: PropTypes.bool, // If truthy then the original data is dropped leaving only the moving average data in the data set
    children: PropTypes.func // child function
  };

  constructor(props) {
    super(props);
    this.defaultWindowPercent = 5; // default window size for moving average
    this.defaultLabelSuffix = ' (moving average)';
  }

  render() {
    const { data, buckets, window, suffix, excludeOriginal } = this.props;
    if (data) {
      return this.props.children({
        adjustedData: MovingAverage.processData({
          data: data,
          buckets: buckets,
          window: window,
          suffix: suffix,
          excludeOriginal: excludeOriginal
        })
      });
    } else {
      return null;
    }
  }
}
