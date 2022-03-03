import React, { memo, useMemo } from 'react';
import { Header } from '@buffetjs/custom';
import { Flex, Padded, Text } from '@buffetjs/core';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useIntl } from 'react-intl';
import { BaselineAlignment } from 'strapi-helper-plugin';
import Bloc from '../../components/Bloc';
import PageTitle from '../../components/SettingsPageTitle';
import makeSelectApp from '../App/selectors';
// [PK] customize app-info page
import { Detail, InfoText } from './components';

const makeSelectAppInfos = () => createSelector(makeSelectApp(), appState => appState.appInfos);

// [PK] customize app-info page

const ApplicationInfosPage = () => {
  const { formatMessage } = useIntl();
  const selectAppInfos = useMemo(makeSelectAppInfos, []);
  const appInfos = useSelector(state => selectAppInfos(state));

  const headerProps = {
    title: { label: formatMessage({ id: 'Settings.application.title' }) },
    content: formatMessage({
      id: 'Settings.application.description',
    }),
  };
  const nodeVersion = formatMessage({ id: 'Settings.application.node-version' });

  return (
    <div>
      <PageTitle name="Application" />
      <Header {...headerProps} />
      <BaselineAlignment top size="3px" />
      <Bloc>
        <Padded left right top size="smd">
          <Padded left right top size="xs">
            <Padded top size="lg">
              <Text fontSize="xs" color="grey" fontWeight="bold">
                App Package Name
              </Text>
              <InfoText content={appInfos.appPackageName} />
            </Padded>
            <Padded top size="lg">
              <Text fontSize="xs" color="grey" fontWeight="bold">
                App Package Version
              </Text>
              <InfoText content={appInfos.appPackageVersion} />
            </Padded>
            <Padded top size="lg">
              <Text fontSize="xs" color="grey" fontWeight="bold">
                Environment
              </Text>
              <InfoText content={appInfos.currentEnvironment} />
            </Padded>
            <Padded top size="lg">
              <Text fontSize="xs" color="grey" fontWeight="bold">
                {nodeVersion}
              </Text>
              <InfoText content={appInfos.nodeVersion} />
            </Padded>
          </Padded>
        </Padded>
        <BaselineAlignment top size="60px" />
      </Bloc>
    </div>
  );
};

export default memo(ApplicationInfosPage);
