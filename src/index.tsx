import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Header from './Header'
import Footer from './Footer'
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material'
import theme from './Theme'
//import './i18n'
import './global.d'

ReactDOM.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Header/>
                <App/>
                <Footer/>
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>,
    document.getElementById('root')
)   