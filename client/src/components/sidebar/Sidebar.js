import React from "react";

const Sidebar = () => {
  return (
    <div>
      <h3 className="text-primary">BXH BÀI HÁT</h3>
      <div className="btn-group w-100 border_all" role="group">
        <button type="button" className="btn btn-danger rounded-pill">
          Việt Nam
        </button>
        <button type="button" className="btn btn-light rounded-pill">
          Âu Mỹ
        </button>
        <button type="button" className="btn btn-light rounded-pill">
          Hàn Quốc
        </button>
        </div>
    </div>
  );
};

export default Sidebar;
