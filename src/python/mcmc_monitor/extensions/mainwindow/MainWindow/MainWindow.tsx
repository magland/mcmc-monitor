import { Modal } from '@material-ui/core';
import { useSubfeed } from 'labbox';
import React, { FunctionComponent, useCallback, useMemo, useReducer, useState } from 'react';
import { MainWindowProps, useWorkspaceViewPlugins } from '../../pluginInterface';
import { parseWorkspaceUri } from '../../pluginInterface/misc';
import { WorkspaceAction, workspaceReducer } from '../../pluginInterface/Workspace';
import ApplicationBar from './ApplicationBar';
import SettingsWindow from './SettingsWindow';

const MainWindow: FunctionComponent<MainWindowProps> = ({ workspaceUri, workspaceRoute, workspaceRouteDispatch, version }) => {
    const workspaceViewPlugin = useWorkspaceViewPlugins().filter(p => (p.name === 'WorkspaceView'))[0]
    if (!workspaceViewPlugin) throw Error('Unable to find workspace view plugin')

    const [settingsVisible, setSettingsVisible] = useState(false)

    const [workspace, workspaceDispatch2] = useReducer(workspaceReducer, {runs: []})
    const handleWorkspaceSubfeedMessages = useCallback((messages: any[]) => {
        messages.forEach(msg => workspaceDispatch2(msg))
    }, [])

    const {feedUri, workspaceName} = parseWorkspaceUri(workspaceUri)

    const subfeedName = useMemo(() => ({workspaceName}), [workspaceName])

    const {appendMessages: appendWorkspaceMessages} = useSubfeed({feedUri, subfeedName, onMessages: handleWorkspaceSubfeedMessages })
    const workspaceDispatch = useCallback((a: WorkspaceAction) => {
        appendWorkspaceMessages([a])
    }, [appendWorkspaceMessages])

    const handleOpenSettings = useCallback(() => {
        setSettingsVisible(true)
    }, [])

    const handleCloseSettings = useCallback(() => {
        setSettingsVisible(false)
    }, [])

    return (
        <div style={{margin: 0}}>
            <ApplicationBar
                onOpenSettings={handleOpenSettings}
            />
            <div style={{margin: 30}}>
                <workspaceViewPlugin.component workspace={workspace} workspaceDispatch={workspaceDispatch} workspaceRoute={workspaceRoute} workspaceRouteDispatch={workspaceRouteDispatch} />
            </div>
            <Modal
                open={settingsVisible}
                onClose={handleCloseSettings}
            >
                <span>
                    <SettingsWindow
                        workspace={workspace}
                        workspaceUri={workspaceUri}
                        version={version}
                    />
                </span>
            </Modal>
        </div>
    )
}

export default MainWindow