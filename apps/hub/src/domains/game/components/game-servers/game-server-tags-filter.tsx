import { Label, MultiSelectFormField } from "@rivet-gg/components";

export function GameServerTagsFilter() {
  return (
    <div className="flex gap-2 items-center">
      <Label>Tags</Label>
      <MultiSelectFormField
        disabled
        options={[]}
        placeholder={"Select tags to filter by"}
        onValueChange={() => {}}
      />
    </div>
  );
}
