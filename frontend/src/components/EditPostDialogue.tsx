import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { EditPostFormData } from "../types/editPost.type"; // Import the Zod schema
import { editPostSchema } from "../schemas/editPost.schema";
import { Group, Public, Lock } from "@mui/icons-material";

interface EditPostDialogProps {
  isEditDialogOpen: boolean;
  setEditDialogOpen: (isOpen: boolean) => void;
  images?: string[];
  removeImage: (index: number) => void;
  handleEditSubmit: (data: EditPostFormData) => void;
  title: string;
  text: string;
  visibility: "public" | "private" | "only-me";
}

const EditPostDialog: React.FC<EditPostDialogProps> = ({
  isEditDialogOpen,
  setEditDialogOpen,
  images,
  removeImage,
  handleEditSubmit,
  title,
  text,
  visibility,
}) => {
  // Initialize react-hook-form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: title,
      text: text,
      images: images || [],
      visibility: visibility as "public" | "private" | "only-me",
    },
  });

  const imagesCount = (images ?? []).length;
  // Define the onSubmit handler with type-safe data
  const onSubmit: SubmitHandler<EditPostFormData> = (data: {
    title: string;
    text: string;
    images?: string[];
    visibility:  "public" | "private" | "only-me";
  }) => {
    console.log(data);
    handleEditSubmit(data);
    setEditDialogOpen(false);
  };

  return (
    <Dialog
      open={isEditDialogOpen}
      onClose={() => setEditDialogOpen(false)}
      fullWidth
    >
      <DialogTitle>Edit Post</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            {...register("title")}
            margin="normal"
            error={!!errors.title}
            helperText={errors.title ? errors.title.message : ""}
          />
          <TextField
            fullWidth
            label="Text"
            multiline
            {...register("text")}
            margin="normal"
            error={!!errors.text}
            helperText={errors.text ? errors.text.message : ""}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="visibility-label">Visibility</InputLabel>
            <Select
              labelId="visibility-label"
              {...register("visibility")}
              defaultValue={visibility} // Set default value from props
              label="Visibility"
              value={watch("visibility")}
            >
              <MenuItem value="public">
                <Public />
                &nbsp; Public
              </MenuItem>
              <MenuItem value="private">
                <Group />
                &nbsp; Friends
              </MenuItem>
              <MenuItem value="only-me">
                <Lock />
                &nbsp; Only Me
              </MenuItem>
            </Select>
          </FormControl>
          {imagesCount > 0 && (
            <div style={{ marginTop: 10 }}>
              {images?.map((imgUrl, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Post image ${index}`}
                    style={{ maxWidth: "100px", marginRight: 10 }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditPostDialog;
