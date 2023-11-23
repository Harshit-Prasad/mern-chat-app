import React, { useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetAllNotificationsQuery } from "../../../slices/api/notificationSlice";
import { setNotification } from "../../../slices/state/notificationSlice";
import Loader from "../Loader/Loader";
import Avatar from "../Avatar/Avatar";

export default function NotificationSideBar({
  handleCloseNotification,
  showNotification,
}) {
  const { notification } = useSelector((state) => state.notification);
  const [getAllNotifications, { isLoading }] =
    useLazyGetAllNotificationsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      (async () => {
        const notifications = await getAllNotifications().unwrap();
        dispatch(setNotification(notifications));
      })();
    } catch (error) {
      toast.error(error?.data?.message);
    }
  }, []);

  return (
    <Offcanvas show={showNotification} onHide={handleCloseNotification}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Notifications</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="py-0">
        {isLoading ? (
          <Loader />
        ) : notification.length === 0 ? (
          <div className="text-center" disabled>
            <em style={{ color: "#fff" }}>No New Messages...</em>
          </div>
        ) : (
          notification.map((notify) => {
            const { chat, sender } = notify.for;
            const { bgColor, name } = sender;

            return (
              <Button
                key={notify._id}
                className="btn-secondary w-100 d-flex justify-content-evenly align-items-center"
              >
                <Avatar bgColor={bgColor} name={name} size={40} />
                New Message from{" "}
                <strong style={{ fontSize: "18px" }}>{name}</strong>
              </Button>
            );
          })
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
