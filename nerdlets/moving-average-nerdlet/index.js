import React from 'react';
import MovingAverage from '../../components/MovingAverage';
import {
  NrqlQuery,
  LineChart,
  Grid,
  GridItem,
  PlatformStateContext,
  ChartGroup
} from 'nr1';
import { timeRangeToNrql } from '@newrelic/nr1-community';

export default class MovingAverageNerdletNerdlet extends React.Component {
  render() {
    const accountId = 2664312;
    const pollInterval = 60000;

    return (
      <div className="demo">
        <PlatformStateContext.Consumer>
          {platformState => {
            const sinceClause = ` ${timeRangeToNrql(platformState)}`;
            return (
              <ChartGroup>
                <Grid>
                  <GridItem columnSpan={4}>
                    <h2>Declarative example</h2>
                    <NrqlQuery
                      pollInterval={pollInterval}
                      accountId={accountId}
                      query={`SELECT average(duration) as 'Duration' from Transaction timeseries max${sinceClause}`}
                    >
                      {({ data }) => {
                        return (
                          <>
                            <MovingAverage
                              window={10}
                              data={data}
                              suffix="(Moving avg)"
                            >
                              {({ adjustedData }) => {
                                return (
                                  <LineChart
                                    style={{ height: '20em' }}
                                    fullWidth
                                    fullHeight
                                    data={adjustedData}
                                  />
                                );
                              }}
                            </MovingAverage>
                          </>
                        );
                      }}
                    </NrqlQuery>
                  </GridItem>
                  <GridItem columnSpan={4}>
                    <h2>Imperative example</h2>
                    <NrqlQuery
                      pollInterval={pollInterval}
                      accountId={accountId}
                      query={`SELECT count(*) as 'Transactions' from Transaction timeseries max ${sinceClause}`}
                    >
                      {({ data }) => {
                        const example2Data = MovingAverage.processData({
                          data: data,
                          window: 5,
                          suffix: '(Moving avg)'
                        });
                        return (
                          <LineChart
                            style={{ height: '20em' }}
                            fullWidth
                            fullHeight
                            data={example2Data}
                          />
                        );
                      }}
                    </NrqlQuery>
                  </GridItem>
                  <GridItem columnSpan={4}>
                    <h2>Moving average only example</h2>
                    <NrqlQuery
                      pollInterval={pollInterval}
                      accountId={accountId}
                      query={`SELECT average(duration) as 'Duration' from Transaction timeseries max ${sinceClause}`}
                    >
                      {({ data }) => {
                        return (
                          <>
                            <MovingAverage
                              window={10}
                              data={data}
                              suffix="(Moving avg)"
                              excludeOriginal
                            >
                              {({ adjustedData }) => {
                                return (
                                  <LineChart
                                    style={{ height: '20em' }}
                                    fullWidth
                                    fullHeight
                                    data={adjustedData}
                                  />
                                );
                              }}
                            </MovingAverage>
                          </>
                        );
                      }}
                    </NrqlQuery>
                  </GridItem>
                  <GridItem columnSpan={4}>
                    <h2>Multiple data fields</h2>
                    <NrqlQuery
                      pollInterval={pollInterval}
                      accountId={accountId}
                      query={`SELECT average(duration) as 'Duration', count(*)/500 as 'Throughput' from Transaction timeseries max ${sinceClause}`}
                    >
                      {({ data }) => {
                        return (
                          <>
                            <MovingAverage
                              window={10}
                              data={data}
                              suffix="(Moving avg)"
                            >
                              {({ adjustedData }) => {
                                return (
                                  <LineChart
                                    style={{ height: '20em' }}
                                    fullWidth
                                    fullHeight
                                    data={adjustedData}
                                  />
                                );
                              }}
                            </MovingAverage>
                          </>
                        );
                      }}
                    </NrqlQuery>
                  </GridItem>
                  <GridItem columnSpan={4}>
                    <h2>Specific window size</h2>
                    <NrqlQuery
                      pollInterval={pollInterval}
                      accountId={accountId}
                      query={`SELECT average(duration) as 'Duration' from Transaction  timeseries max ${sinceClause}`}
                    >
                      {({ data }) => {
                        return (
                          <>
                            <MovingAverage
                              buckets={50}
                              data={data}
                              suffix="(Moving avg)"
                            >
                              {({ adjustedData }) => {
                                return (
                                  <LineChart
                                    style={{ height: '20em' }}
                                    fullWidth
                                    fullHeight
                                    data={adjustedData}
                                  />
                                );
                              }}
                            </MovingAverage>
                          </>
                        );
                      }}
                    </NrqlQuery>
                  </GridItem>
                  <GridItem columnSpan={4}>
                    <h2>Percentiles</h2>
                    <NrqlQuery
                      pollInterval={pollInterval}
                      accountId={accountId}
                      query={`SELECT percentile(duration,50,75) as 'Duration' from Transaction timeseries max ${sinceClause}`}
                    >
                      {({ data }) => {
                        return (
                          <>
                            <MovingAverage
                              window={5}
                              data={data}
                              suffix="(Moving avg)"
                            >
                              {({ adjustedData }) => {
                                return (
                                  <LineChart
                                    style={{ height: '20em' }}
                                    fullWidth
                                    fullHeight
                                    data={adjustedData}
                                  />
                                );
                              }}
                            </MovingAverage>
                          </>
                        );
                      }}
                    </NrqlQuery>
                  </GridItem>
                  <GridItem columnSpan={4}>
                    <h2>Faceted data</h2>
                    <NrqlQuery
                      pollInterval={pollInterval}
                      accountId={accountId}
                      query={`SELECT percentile(duration,90) as '90pc Duration' from Transaction facet appName limit 5 timeseries max ${sinceClause}`}
                    >
                      {({ data }) => {
                        return (
                          <>
                            <MovingAverage
                              window={5}
                              data={data}
                              suffix=""
                              excludeOriginal
                            >
                              {({ adjustedData }) => {
                                return (
                                  <LineChart
                                    style={{ height: '20em' }}
                                    fullWidth
                                    fullHeight
                                    data={adjustedData}
                                  />
                                );
                              }}
                            </MovingAverage>
                          </>
                        );
                      }}
                    </NrqlQuery>
                  </GridItem>
                  <GridItem columnSpan={4}>
                    <h2>Faceted data, multiple fields</h2>
                    <NrqlQuery
                      pollInterval={pollInterval}
                      accountId={accountId}
                      query={`SELECT count(*) as 'Throughput', average(duration) as duration from Transaction facet appName limit 5 timeseries max ${sinceClause}`}
                    >
                      {({ data }) => {
                        return (
                          <>
                            <MovingAverage
                              window={5}
                              data={data}
                              suffix=""
                              excludeOriginal
                            >
                              {({ adjustedData }) => {
                                return (
                                  <LineChart
                                    style={{ height: '20em' }}
                                    fullWidth
                                    fullHeight
                                    data={adjustedData}
                                  />
                                );
                              }}
                            </MovingAverage>
                          </>
                        );
                      }}
                    </NrqlQuery>
                  </GridItem>
                </Grid>
              </ChartGroup>
            );
          }}
        </PlatformStateContext.Consumer>
      </div>
    );
  }
}
