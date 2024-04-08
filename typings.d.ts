interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "todo" | "inprogress" | "done";

interface Column {
  id: TypedColumn;
  tasks: Tasks[];
}

interface Tasks {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: string;
}

interface Image {
  buckeId: string;
  fileId: string;
}
