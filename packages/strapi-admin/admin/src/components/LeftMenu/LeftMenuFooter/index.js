/**
 *
 * LeftMenuFooter
 *
 */

import React from 'react';
import { PropTypes } from 'prop-types';
import Wrapper, { A } from './Wrapper';

function LeftMenuFooter({ version }) {
  // [PK] remove useless codes
  
  return (
    <Wrapper>
      <div className="poweredBy">
        <A key="website" href="" target="_blank" rel="noopener noreferrer">
          Strapi
        </A>
        &nbsp;
        <A
          href=""
          key="github"
          target="_blank"
          rel="noopener noreferrer"
        >
          v{version}
        </A>
      </div>
    </Wrapper>
  );
}

LeftMenuFooter.propTypes = {
  version: PropTypes.string.isRequired,
};

export default LeftMenuFooter;
