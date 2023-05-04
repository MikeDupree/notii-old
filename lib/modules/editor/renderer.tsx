import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editable, useEditor } from '@wysimark/react';

type Props = {};

const renderer = (props: Props) => {
  const editor = useEditor({
    initialMarkdown: "# Notii\n\nGet started writing your notes!",
    height: 350
  })
  return <Editable editor={editor} />
};

export default renderer;
