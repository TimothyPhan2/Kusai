# 🎵 Kusai

An interactive web game where players test their knowledge of anime music. Listen to iconic anime songs and guess which series they're from! 

> Built during the FartLabs Hackathon 2025.

## Features

- 🎮 Interactive quiz gameplay
- 🎵 Audio playback of anime songs
- ✨ Beautiful, responsive UI with animations
- 🏆 Score tracking and end-game results
- 📱 Mobile-friendly design

## Tech Stack

- **Runtime**: [Deno](https://deno.land/)
- **Framework**: [HTX](https://jsr.io/@fartlabs/htx) 
- **Routing**: [@fartlabs/rt](https://jsr.io/@fartlabs/rt)
- **Styling**: [Fart.css](https://css.fart.tools)

## Getting Started

1. Make sure you have [Deno](https://deno.com/) installed
2. Clone the repository
3. Run the development server:
   ```bash
   deno task dev
   ```
4. Open [http://localhost:8000](http://localhost:8000) in your browser


## Game Flow

1. Player starts at the landing page
2. Clicks "Start Quiz" to begin
3. For each song:
   - Listen to the audio clip
   - Choose from 4 possible anime titles
   - Get immediate feedback via modal for wrong answers
   - Score points for correct answers
4. View final score and performance message at the end
5. Option to play again or return home
