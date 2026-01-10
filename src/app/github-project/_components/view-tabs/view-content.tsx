import { AnimatePresence } from "motion/react";
import { useView } from "../../_queries/use-view";
import { ViewTaskBoardPanel } from "../view-task-board-panel";
import { ErrorContent } from "./error-content";
import { LoadingContent } from "./loading-content";
import { Resizable, ResizeCallback } from "re-resizable";
import { useRef, useLayoutEffect } from "react";
import { View } from "../../_backend/view/api";
import { SlicerPanelWidthStorage } from "../../_lib/slicer-panel-width-storage";
import { ResizablePanel } from "../resizable-panel";
import { SlicerPanel } from "../slicer-panel/slicer-panel";

type Props = { viewId: string };

export const ViewContent: React.FC<Props> = ({ viewId }) => {
  const { data: view, status: viewStatus } = useView(viewId);

  if (viewStatus === "error") {
    return <ErrorContent />;
  }

  return (
    <>
      {view && (
        <div className="grid grid-cols-[auto_1fr] grid-rows-1">
          <ResizableViewSlicerPanel view={view} />
          <ViewTaskBoardPanel view={view} />
        </div>
      )}
      <AnimatePresence>
        {viewStatus === "pending" && <LoadingContent />}
      </AnimatePresence>
    </>
  );
};

const ResizableViewSlicerPanel: React.FC<{ view: View }> = ({ view }) => {
  const slicerPanelRef = useRef<Resizable>(null);

  const handleResize: ResizeCallback = (_, __, element) => {
    SlicerPanelWidthStorage.set({
      viewId: view.id,
      width: element.offsetWidth,
    });
  };

  useLayoutEffect(() => {
    const width = SlicerPanelWidthStorage.get(view.id);
    if (width) {
      slicerPanelRef.current?.updateSize({ width });
    }
  }, [view.id]);

  return (
    <ResizablePanel
      resizableRef={slicerPanelRef}
      key={view.id}
      direction="right"
      minWidth={200}
      defaultSize={{ width: 400 }}
      onResizeStop={handleResize}
    >
      <SlicerPanel columns={view.columns} />
    </ResizablePanel>
  );
};
