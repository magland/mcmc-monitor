import { AppBar, Toolbar } from '@material-ui/core';
import { useSubfeed } from 'labbox';
import React, { FunctionComponent, useCallback, useReducer } from 'react';
import { MainWindowProps, useWorkspaceViewPlugins, workspaceRouteReducer } from '../../pluginInterface';
import { WorkspaceAction, workspaceReducer } from '../../pluginInterface/Workspace';
import HitherJobMonitorControl from './HitherJobMonitorControl';
import logo from './logo.svg';
import ServerStatusControl from './ServerStatusControl';

const MainWindow: FunctionComponent<MainWindowProps> = () => {
    const workspaceViewPlugin = useWorkspaceViewPlugins().filter(p => (p.name === 'WorkspaceView'))[0]
    if (!workspaceViewPlugin) throw Error('Unable to find workspace view plugin')

    const [workspace, workspaceDispatch2] = useReducer(workspaceReducer, {runs: []})
    const handleWorkspaceSubfeedMessages = useCallback((messages: any[]) => {
        messages.forEach(msg => workspaceDispatch2(msg))
    }, [])
    const {appendMessages: appendWorkspaceMessages} = useSubfeed({feedUri: 'feed://91e20967e11b30db1894a6f8b42d6437215494cd815d3d9b926bcab90f5924a9', subfeedName: '~7033bedf6c058a2871dc22bda839652c5abe0097', onMessages: handleWorkspaceSubfeedMessages })
    const workspaceDispatch = useCallback((a: WorkspaceAction) => {
        appendWorkspaceMessages([a])
    }, [appendWorkspaceMessages])

    const [workspaceRoute, workspaceRouteDispatch] = useReducer(workspaceRouteReducer, {page: 'main'})

    const appBarHeight = 50

    return (
        <div style={{margin: 0}}>
            <AppBar position="static" style={{height: appBarHeight, background: '#d85636'}}>
                <Toolbar>
                <img src={logo} className="App-logo" alt="logo" height={30} style={{paddingBottom: 15}} />
                &nbsp;<span style={{paddingBottom: 10, color: '#312a00', fontFamily: 'sans-serif', fontWeight: 'bold'}}>MCMC Monitor</span>
                <span style={{marginLeft: 'auto'}} />
                <span style={{paddingBottom: 15, color: '#312a00'}}>
                    <ServerStatusControl />
                    <HitherJobMonitorControl />
                </span>
                </Toolbar>
            </AppBar>
            <div style={{margin: 30}}>
                
                <workspaceViewPlugin.component workspace={workspace} workspaceDispatch={workspaceDispatch} workspaceRoute={workspaceRoute} workspaceRouteDispatch={workspaceRouteDispatch} />
            </div>
        </div>
    )
}

export default MainWindow