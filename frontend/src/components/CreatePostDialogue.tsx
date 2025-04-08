import { zodResolver } from "@hookform/resolvers/zod";
import {
  Group,
  Lock,
  Public,
} from "@mui/icons-material";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { storage } from "../config";
import { useCreatePost } from "../hooks";
import {
  CreatePostFormData,
  createPostSchema,
} from "../schemas/createPost.schema";
import { Post } from "../types/post.type"; // Adjust the path if needed
import { UserCommunitySelect } from "./UserCommunitySelect";

interface PostCreationFormProps {
  open: boolean;
  onClose: () => void;
  authorName: string;
  authorId: string;
}

export const CreatePostDialog: React.FC<PostCreationFormProps> = ({
  authorName,
  authorId,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();

  const { mutate: createPost } = useCreatePost();

  const { communityId: urlCommunityId } = useParams<{ communityId: string }>();
  const [communityId, setCommunityId] = useState<string>(urlCommunityId || "");
  
  useEffect(() => setCommunityId(urlCommunityId || ""), [urlCommunityId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      text: "",
      visibility: "public",
      images: [],
    },
  });

  const images = watch("images");

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const uploadedURLs: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `images/${file.name}-${Date.now()}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedURLs.push(downloadURL);
      }

      setValue('images', uploadedURLs); 
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  // Handle creating a new post
  const onSubmit = (data: CreatePostFormData) => {
    const postData: Post = {
      ...data,
      postId: "", 
      authorId: authorId,
      communityId,
      authorName: authorName,
      authorImg: "default-image-url", 
      createdAt: new Date(),
      updatedAt: undefined,
      commentCount: 0,
      likes: [],
      dislikes: [],
    };
    createPost(postData, {
      onSuccess: () => {
        enqueueSnackbar("Post created successfully!", {
          variant: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Create a Post</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2} py={1}>
            {/* Community Select */}
            <UserCommunitySelect
              communityId={communityId}
              setCommunityId={setCommunityId}
            />
            {errors.communityId && <p>{errors.communityId.message}</p>}

            {/* Post Title */}
            <TextField
              label="Post Title"
              fullWidth
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            {/* Post Text */}
            <TextField
              label="Post text"
              fullWidth
              multiline
              {...register("text")}
              error={!!errors.text}
              helperText={errors.text?.message}
            />

            {/* Visibility Select */}
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="visibility-label">Visibility</InputLabel>
              <Select
                labelId="visibility-label"
                value={watch("visibility")}
                {...register("visibility")}
                label="Visibility"
              >
                <MenuItem value="public"><Public />&nbsp; Public</MenuItem>
                <MenuItem value="private"><Group />&nbsp; Friends</MenuItem>
                <MenuItem value="only-me"><Lock />&nbsp; Only Me</MenuItem>
              </Select>
            </FormControl>

            {/* Image Upload */}
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-images"
              multiple
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-images">
              <IconButton
                color="primary"
                aria-label="upload pictures"
                component="span"
              >
                <UploadIcon />
              </IconButton>
            </label>

            {/* Preview Images */}
            {images?.map((image, idx) => (
              <img
                key={idx}
                src={image}
                alt={`uploaded-${idx}`}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ))}
          </Stack>

          <DialogActions>
            <Button onClick={()=>{onClose();reset()}} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
