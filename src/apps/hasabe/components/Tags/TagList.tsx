import SellIcon from "@mui/icons-material/Sell";
import { Button } from "@mui/material";

import { Tag } from "../../utils/types";

type TagListProps = {
  disabled?: boolean;
  active: (string | null)[];
  tags: Tag[];
  onTagClick: (tag: Tag | null) => void;
};

const TagList = ({
  disabled = false,
  active,
  tags,
  onTagClick,
}: TagListProps) => {
  return (
    <div className="TagList">
      {tags.map((tag) => {
        const isActive = active.find((id) => id === tag.id);

        return (
          <Button
            sx={{ mr: 1, mb: 1 }}
            disabled={disabled}
            variant={isActive ? "contained" : "outlined"}
            key={tag.id}
            onClick={() => onTagClick(!isActive ? tag : null)}
            startIcon={<SellIcon />}
          >
            {tag.name}
          </Button>
        );
      })}
    </div>
  );
};

export default TagList;
