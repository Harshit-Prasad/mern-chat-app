import React, { useCallback, useEffect } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  useLazyGetAllNotificationsQuery,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "../../../slices/api/notificationSlice";
import { setNotification } from "../../../slices/state/notificationSlice";
import Loader from "../Loading/Loader";
import Avatar from "../Avatar/Avatar";
import {
  setSelectedChat,
  setShowChatList,
} from "../../../slices/state/chatSlice";

export default function NotificationSideBar({
  handleCloseNotification,
  showNotification,
}) {
  const { notification } = useSelector((state) => state.notification);
  const [getAllNotifications, { isLoading }] =
    useLazyGetAllNotificationsQuery();
  const [deleteNotification, { isLoading: deletingNotification }] =
    useDeleteNotificationMutation();
  const [deleteAllNotification, { isLoading: deletingAllNotification }] =
    useDeleteAllNotificationsMutation();

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

  const handleRemoveNotification = useCallback(
    async (id, chat, event) => {
      try {
        const updatedNotification = notification.slice();
        let notificationIndex;

        updatedNotification.forEach((notify, i) => {
          if (notify._id === id) {
            notificationIndex = i;
            return;
          }
        });

        dispatch(setSelectedChat(chat));
        dispatch(setShowChatList(false));

        updatedNotification.splice(notificationIndex, 1);
        dispatch(setNotification(updatedNotification));

        const { ok } = await deleteNotification(id).unwrap();
      } catch (error) {
        toast.error(error?.data?.message);
      }
    },
    [notification]
  );

  const handleDeleteAllNotifications = useCallback(async () => {
    console.log("clicked");
    try {
      const { ok } = await deleteAllNotification().unwrap();

      dispatch(setNotification([]));
    } catch (error) {
      toast.error(error?.data?.message || "Something Went Wrong");
    }
  }, [notification]);

  return (
    <Offcanvas show={showNotification} onHide={handleCloseNotification}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Notifications</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="py-0">
        <Button
          onClick={handleDeleteAllNotifications}
          disabled={notification.length ? false : true}
          className="btn-primary w-100 text-center"
        >
          Clear All
        </Button>
        {deletingNotification && <Loader />}
        {deletingAllNotification && <Loader />}
        {isLoading ? (
          <Loader />
        ) : notification.length === 0 ? (
          <div className="text-center mt-2" disabled>
            <em style={{ color: "#fff" }}>No New Messages...</em>
          </div>
        ) : (
          <div>
            {notification.map((notify) => {
              const { bgColor, name } = notify.from;
              return (
                <Button
                  key={notify._id}
                  onClick={handleRemoveNotification.bind(
                    this,
                    notify._id,
                    notify.chat
                  )}
                  className="btn-secondary w-100 d-flex justify-content-evenly align-items-center mt-1"
                >
                  <Avatar bgColor={bgColor} name={name} size={40} />
                  New Message from
                  <strong style={{ fontSize: "18px" }}>{name}</strong>
                </Button>
              );
            })}
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
