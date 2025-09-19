import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Modal({ isOpen, onClose, title, description, children, primaryAction, secondaryAction }) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <Dialog.Panel className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                {title ? (
                  <Dialog.Title className="text-xl font-semibold text-slate-900">{title}</Dialog.Title>
                ) : null}
                {description ? (
                  <Dialog.Description className="mt-2 text-sm text-slate-500">{description}</Dialog.Description>
                ) : null}

                <div className="mt-6 space-y-4 text-sm text-slate-600">{children}</div>

                {(primaryAction || secondaryAction) && (
                  <div className="mt-8 flex flex-wrap justify-end gap-3">
                    {secondaryAction}
                    {primaryAction}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
