import React from "react";
// import Center from "../center/Center";
import Sidebar from "../sidebar/Sidebar";
import Module1 from "../center/module1/Module1";
import Module2 from "../center/module2/Module2";
import Module3 from "../center/module3/Module3";

const Content = () => {
  return (
    <div className="row mt-3">
      <div className="col-md-9">
        <Module1 />
        <Module2 />
        <Module3 />
      </div>

      <div className="col-md-3">
        <Sidebar />
      </div>
    </div>
  );
};

export default Content;
