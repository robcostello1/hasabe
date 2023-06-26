import "./TagList.css";

import { Button } from "@mui/material";

import { Tag } from "../../utils/types";

type TagListProps = {
  active: (string | null)[];
  tags: Tag[];
  onTagClick: (tag: Tag | null) => void;
};

const TagList = ({ active, tags, onTagClick }: TagListProps) => {
  return (
    <div className="TagList">
      <div>Tags:</div>

      {tags.map((tag) => {
        const isActive = active.find((id) => id === tag.id);

        return (
          <Button
            variant={isActive ? "contained" : "outlined"}
            key={tag.id}
            onClick={() => onTagClick(!isActive ? tag : null)}
          >
            {tag.name}
          </Button>
        );
      })}
    </div>
  );
};

export default TagList;
