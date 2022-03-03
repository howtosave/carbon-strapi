/**
 *
 * LeftMenuFooter
 *
 */

import React from 'react';
import { PropTypes } from 'prop-types';
import Wrapper from './Wrapper';

function LeftMenuFooter({ version }) {
  // [PK] display version only

  return (
    <Wrapper>
      <div className="poweredBy">
        v{version}
      </div>
    </Wrapper>
  );
}

LeftMenuFooter.propTypes = {
  version: PropTypes.string.isRequired,
};

export default LeftMenuFooter;
