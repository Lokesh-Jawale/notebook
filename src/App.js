import React from 'react';
import './App.css';
import Note from './Components/Note.js';
import Subject from './Components/Subject.js';
import Topic from './Components/Topic.js';

function App() {

    return (
        <div className="App">

            <div className="app__header">
                <h1>Notebook</h1>
            </div>

            {/* Main notebook container */}
            <div className="app__main row container-fluid">

                {/* Subject and Topic Selection... block*/}
                <div className="col-lg-6">
                    <div className="app__subject">
                        <span className="app__subjectHeader"> Select Subject:</span>
                        <div className="app__subjectSelectDialog">
                            <Subject />
                        </div>
                    </div>
                    <br />
                    <div className="app__subject">
                        <span className="app__subjectHeader"> Select Topic:</span>
                        <div className="app__subjectSelectDialog">
                            <Topic />
                        </div>
                    </div>
                </div>
                
                {/* Notes adding, editing... block */}
                <div className="app__notes col-lg-6">
                    <Note />
                </div>

            </div>

            <div className="footer container-fluid">
                <p>Notebook © 2021. All rights reserved.</p>
                <h6>Notebook.com</h6>
            </div>

        </div>
  );
}

export default App;
