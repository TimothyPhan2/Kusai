import { Song } from "./types.ts";

export const songs: Song[] = [
  {
    id: 1,
    title: "A Cruel Angel's Thesis",
    anime: "Neon Genesis Evangelion",
    url: "https://example.com/song1.mp3", // Replace with actual song URL
    choices: [
      "Neon Genesis Evangelion",
      "Dragon Ball Z",
      "Sailor Moon",
      "Gundam Wing",
    ],
  },
  {
    id: 2,
    title: "Tank!",
    anime: "Cowboy Bebop",
    url: "https://example.com/song2.mp3",
    choices: [
      "Cowboy Bebop",
      "Space Dandy",
      "Trigun",
      "Outlaw Star",
    ],
  },
  {
    id: 3,
    title: "Gurenge",
    anime: "Demon Slayer",
    url: "https://example.com/song3.mp3",
    choices: [
      "Demon Slayer",
      "Jujutsu Kaisen",
      "My Hero Academia",
      "Black Clover",
    ],
  },
];
