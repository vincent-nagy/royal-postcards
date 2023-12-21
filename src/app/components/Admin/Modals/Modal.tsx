import { FiX } from "react-icons/fi";

const Modal = ({
  children,
  closeModal,
  isOpen,
}: {
  children: React.ReactNode;
  closeModal: () => void;
  isOpen: boolean;
}) => {
  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="content">
            <span className="close" onClick={closeModal}>
              <FiX />
            </span>
            {children}
          </div>
        </div>
      )}
      <style jsx>{`
        .modal {
          display: block;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgb(0, 0, 0);
          background-color: rgba(0, 0, 0, 0.8);
        }

        .content {
          background-color: #fefefe;
          margin: 15% auto;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 500px;
        }

        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }

        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Modal;
