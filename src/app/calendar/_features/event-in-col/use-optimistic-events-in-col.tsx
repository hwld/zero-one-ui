import { Event } from "../../_backend/event-store";
import { useMoveEventInCol } from "./move-event-provider";
import { useResizeEventInCol } from "./resize-event-provider";
import { getEventsInCol } from "./utils";

/**
 *  日付を指定して、EventのMoveやResizeの状態から更新後のeventsを返す
 */
export const useOptimisticEventsInCol = ({ day, events }: { day: Date; events: Event[] }) => {
  const { resizeEventPreview } = useResizeEventInCol();
  const { isEventMoving, moveEventPreview } = useMoveEventInCol();

  return getEventsInCol({
    date: day,
    // tanstack-queryのキャッシュレベルで実装すると、他の更新があったときに壊れてしまうので
    // 楽観的更新をここで実装する
    events: events.map((event): Event => {
      // イベントのリサイズがバックエンドに反映されていない場合は、リサイズ後のPreviewのデータを返したい
      const resizePreviewVisible = event.id === resizeEventPreview?.id;

      // イベントはUI上で移動中ではないが、イベントの移動がバックエンドに反映されていない場合は、移動後のPreviewのデータを返したい
      // resizeと違って、移動中にはPreviewを使って移動中のイベントを表示する専用のコンポーネントがあるので、移動中はPreviewのデータではなくEventをそのまま返す
      const movePreviewVisible = !isEventMoving && event.id === moveEventPreview?.id;

      if (isEventMoving && event.id === moveEventPreview?.id) {
        return event;
      }

      if (resizePreviewVisible && movePreviewVisible) {
        if (resizeEventPreview.updatedAt > moveEventPreview.updatedAt) {
          return resizeEventPreview;
        } else {
          return moveEventPreview;
        }
      }

      if (movePreviewVisible) {
        return moveEventPreview;
      }

      if (resizePreviewVisible) {
        return resizeEventPreview;
      }

      return event;
    }),
  });
};
