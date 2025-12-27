import React, { useEffect, useState } from 'react';
import { IonSpinner } from '@ionic/react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ffmpeg_thumnail } from 'ionic-thumbnail';
import imga from '../../public/favicon.png';

interface Props {
  src: string; // sandbox URL or Blob URL
  style?: React.CSSProperties;
  Name: string;
  Size: number;
  onClick?: () => void;
}

const VideoRenderer: React.FC<Props> = ({ src, style, Name, Size, onClick }) => {
  const [poster, setPoster] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePoster = async () => {
      setLoading(true);
      try {
        const thumbnail = await captureThumbnail2(src, Name, Size);
        setPoster(thumbnail || imga);
      } catch (err) {
        console.error('Error generating thumbnail:', err);
        setPoster(imga);
      } finally {
        setLoading(false);
      }
    };

    generatePoster();
  }, [src]);

  const captureThumbnail2 = async (
    nativePath: string,
    fileName: string,
    fileSize: number
  ): Promise<string | null> => {
    try {
      const folder = 'thumbnails';
      const thumbnailFileName = `${fileName}_${fileSize}_thumb.jpg`;
      const fullPath = `${folder}/${thumbnailFileName}`;

      // Try reading cached thumbnail
      try {
        const existing = await Filesystem.readFile({
          path: fullPath,
          directory: Directory.Cache,
        });
        return `data:image/jpeg;base64,${existing.data}`;
      } catch {
        // Not cached yet
      }

      // Generate new thumbnail using ffmpeg plugin
      const result = await ffmpeg_thumnail.generateThumbnail({ path: nativePath });
      const base64Thumbnail = result.data;
      if (!base64Thumbnail) throw new Error('No thumbnail data');

      // Save to cache
      await Filesystem.writeFile({
        path: fullPath,
        data: base64Thumbnail,
        directory: Directory.Cache,
        recursive: true,
      });

      return `data:image/jpeg;base64,${base64Thumbnail}`;
    } catch (error) {
      console.error('Failed to capture thumbnail:', error);
      return null;
    }
  };

  if (loading) return <IonSpinner name="dots" />;
  if (!poster) return <div>Failed to load video thumbnail</div>;

  return <img src={poster} alt="Video thumbnail" onClick={onClick} style={style} />;
};

export default VideoRenderer;
