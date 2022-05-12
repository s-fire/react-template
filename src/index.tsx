import React from "react";
import { render } from 'react-dom';

try {
    const rootElement = document.getElementById('root');
    console.log("运行");
    const App = () => {
        return <div className="hello">Hello</div>
    };
    render(<App />, rootElement)
} catch (e) {
    console.log('e', e);
}

