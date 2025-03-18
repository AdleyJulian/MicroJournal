import React, { useState, useEffect } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Globe } from "lucide-react-native";

interface FaviconProps {
  website: string;
  size?: number;
}

export const Favicon: React.FC<FaviconProps> = ({ website, size = 16 }) => {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const extractDomain = (website: string) => {
    try {
      const url = new URL(website);
      return url.hostname;
    } catch (error) {
      console.error("Invalid URL:", website);
      return null;
    }
  };

  useEffect(() => {
    if (!website) {
      setLoading(false);
      setFaviconUrl(null);
      return;
    }

    const domain = extractDomain(website);
    if (domain) {
      // Request larger icon (64px) and scale down
      setFaviconUrl(
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      );
    } else {
      setFaviconUrl(null);
    }
    setLoading(false);
  }, [website]);

  if (loading) {
    return null;
  }

  return (
    <View style={[styles.iconContainer, { width: size, height: size }]}>
      {faviconUrl ? (
        <Image
          source={{ uri: faviconUrl }}
          style={[styles.favicon, { width: size, height: size }]}
          onError={() => setFaviconUrl(null)}
        />
      ) : (
        <Globe size={size} color="#666" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  favicon: {
    resizeMode: "cover",
  },
});
