import { useCallback, useEffect, useState } from "react";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

let count = 0;

const generateId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

let memorystate = {
  toasts: [],
};

const listeners = [];

const dispatch = (action) => {
  memorystate = reducer(memorystate, action);

  listeners.forEach((listener) => {
    listener(memorystate);
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toast.id ? { ...toast, ...action.toast } : toast,
        ),
      };

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          toast.id === action.toastId ? { ...toast, open: false } : toast,
        ),
      };

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
      };

    default:
      return state;
  }
};

const addToRemoveQueue = (toastId) => {
  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);
};

export const toast = ({
  title,
  description,
  variant = "default",
  duration = TOAST_REMOVE_DELAY,
  ...props
}) => {
  const id = generateId();

  const newToast = {
    id,
    title,
    description,
    variant,
    open: true,
    ...props,
  };

  dispatch({ type: "ADD_TOAST", toast: newToast });

  setTimeout(() => {
    dispatch({ type: "DISMISS_TOAST", toastId: id });

    addToRemoveQueue(id);
  }, duration);

  return {
    id,

    dismiss: () => {
      dispatch({ type: "DISMISS_TOAST", toastId: id });
      addToRemoveQueue(id);
    },

    update: (data) => {
      dispatch({ type: "UPDATE_TOAST", toast: { ...data, id } });
    },
  };
};

export const useToast = () => {
  const [state, setState] = useState(memorystate);

  useEffect(() => {
    listeners.push(setState);

    return () => {
      const index = listeners.indexOf(setState);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId) => {
      dispatch({ type: "DISMISS_TOAST", toastId });
    },
  };
};
