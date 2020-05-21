import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import './s.scss';
import { waitForElementToBeRemoved } from '@testing-library/react';

const InfiniteList = ({
  query,
  queryVariables,
  headerRenderer,
  rowRenderer,
  noMoreEntriesMessage,
}) => {
  const [cursor, setCursor] = useState(null);
  const [entries, setEntries] = useState([]);

  const { data, loading, error } = useQuery(query, {
    fetchPolicy: 'network-only',
    variables: {
      after: cursor,
      ...queryVariables,
    },
    onCompleted: rsp => {
      const { data: newEntries } = rsp.runtimes;
      setEntries(prev => [...prev, ...newEntries]);
    },
  });

  useEffect(() => {
    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  });

  if (error) return `Error! ${error.message}`;

  const canScrollMore = loading || data.runtimes.totalCount > entries.length;

  function handleScroll(ev) {
    console.group('handleScroll');
    console.log('handleScroll called');
    const {
      scrollHeight,
      scrollTop,
      clientHeight,
    } = ev.target.scrollingElement;

    const hasReachedBottom = scrollHeight - scrollTop === clientHeight;
    console.log(
      'handleScroll data',
      !!ev.target.scrollingElement,
      scrollHeight,
      scrollTop,
      clientHeight,
      hasReachedBottom,
    );
    console.groupEnd('handleScroll');
    if (hasReachedBottom && data.runtimes.pageInfo.hasNextPage) {
      setCursor(data.runtimes.pageInfo.endCursor);
    }
  }

  return (
    <>
      <p className="panel">
        <h4>The Hasselhoff control panel</h4>
        <div>
          <button
            onClick={() => {
              const ev = {
                target: {
                  scrollingElement: {
                    scrollHeight: 401,
                    scrollTop: 47,
                    clientHeight: 354,
                  },
                },
              };
              handleScroll(ev);
            }}
          >
            Pretend there was an event
          </button>
        </div>
        <div style={{ float: 'right' }}>
          <button
            onClick={() => {
              if (data.runtimes.pageInfo.hasNextPage) {
                setCursor(data.runtimes.pageInfo.endCursor);
              } else {
                console.log('no next page');
              }
            }}
          >
            Gimme more runtimes!
          </button>
          <button
            onClick={() => {
              window.open('https://www.youtube.com/watch?v=PldT2jq7ApM');
            }}
          >
            Play Baywatch intro
          </button>
        </div>
      </p>
      <table className="fd-table">
        <thead className="fd-table__header">
          <tr className="fd-table__row">
            {headerRenderer().map((h, index) => (
              <th className="fd-table__cell" scope="col" key={h || index}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="fd-table__body">
          {entries.map(r => (
            <tr className="fd-table__row" key={r.id}>
              {rowRenderer(r).map(([key, value]) => (
                <td className="fd-table__cell" key={key}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="fd-has-text-align-center fd-has-padding-bottom-xs">
        {!!loading && <Spinner />}
        {!canScrollMore && noMoreEntriesMessage}
      </div>
    </>
  );
};

const Spinner = () => {
  return (
    <div className="fd-spinner" aria-hidden="false" aria-label="Loading">
      <div className="fd-spinner__body"></div>
    </div>
  );
};

export default InfiniteList;

InfiniteList.propTypes = {
  query: PropTypes.shape({
    data: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.object,
  }).isRequired,
  queryVariables: PropTypes.object,
  headerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  noMoreEntriesMessage: PropTypes.string,
};

InfiniteList.defaultProps = {
  noMoreEntriesMessage: 'No more data',
};
