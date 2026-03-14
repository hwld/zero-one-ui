import {
  Columns2Icon,
  GalleryHorizontalEndIcon,
  LayersIcon,
  LineChartIcon,
  MoveVerticalIcon,
  PenIcon,
  Rows2Icon,
  TableRowsSplitIcon,
  TextIcon,
  UploadIcon,
} from "lucide-react";
import { DropdownCard } from "../dropdown/card";
import { DropdownItem, DropdownItemGroup, DropdownItemList } from "../dropdown/item";
import { ViewOptionMenuMode } from "./trigger";
import { Divider } from "../divider";
import { ViewConfigMenuItem } from "./item";
import { DeleteViewItem } from "./delete-view-item";
import { ViewSummary } from "../../_backend/view/api";
import { ViewUpdateDialogTrigger } from "../view-update-dialog";

type Props = {
  viewSummary: ViewSummary;
  onChangeMode: (mode: ViewOptionMenuMode) => void;
};

export const ViewOptionMenu: React.FC<Props> = ({ viewSummary, onChangeMode }) => {
  return (
    <DropdownCard width={320}>
      <DropdownItemGroup group="configuration">
        <ViewConfigMenuItem
          icon={TextIcon}
          title="Fields"
          value="Title, Assignees, Status, Foo, Bar"
          onClick={() => {
            onChangeMode("fieldsConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={Columns2Icon}
          title="Column by:"
          value="Status"
          onClick={() => {
            onChangeMode("columnByConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={Rows2Icon}
          title="Group by"
          value="none"
          onClick={() => {
            onChangeMode("groupByConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={MoveVerticalIcon}
          title="Sort by"
          value="manual"
          onClick={() => {
            onChangeMode("sortByConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={LayersIcon}
          title="Field sum"
          value="Count"
          onClick={() => {
            onChangeMode("fieldSumConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={TableRowsSplitIcon}
          title="Slice by"
          value="Status"
          onClick={() => {
            onChangeMode("sliceByConfig");
          }}
        />
      </DropdownItemGroup>
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={LineChartIcon} label="Generate chart" />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <ViewUpdateDialogTrigger viewSummary={viewSummary}>
          <DropdownItem icon={PenIcon} label="Rename view" />
        </ViewUpdateDialogTrigger>
        <DropdownItem icon={GalleryHorizontalEndIcon} label="Save changes to new view" />
        <DeleteViewItem viewSummary={viewSummary} />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={UploadIcon} label="Export view data" />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <div className="grid h-8 grid-cols-2 gap-2">
          <button className="grow rounded-md text-neutral-300 transition-colors hover:bg-white/15">
            Discard
          </button>
          <button className="grow rounded-md border border-green-500 text-green-500 transition-colors hover:bg-green-500/15">
            Save
          </button>
        </div>
      </DropdownItemList>
    </DropdownCard>
  );
};
