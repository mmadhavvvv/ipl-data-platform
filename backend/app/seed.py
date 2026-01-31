import json
import os
import sys
# Add parent directory to path to allow importing from database.py if run from app dir, 
# but usually run as module or from root. 
# We assume run from root as specified in instructions.

from database import engine, SessionLocal
from datetime import datetime
from models import Base, Team, Venue, Match, Standing, PlayerStat

# DATABASE_URL is handled in database.py


def seed_data():
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        
        base_path = "c:/Users/HP/.gemini/antigravity/scratch/portfolio/dataset/Indian_Premier_League_2022-03-26"
        
        # Seed Teams
        print("Seeding teams...")
        teams_path = os.path.join(base_path, "teams", "teams.json")
        with open(teams_path, "r") as f:
            teams_data = json.load(f)
            for t in teams_data:
                if not db.query(Team).filter(Team.tid == t["tid"]).first():
                    team = Team(
                        tid=t["tid"],
                        title=t["title"],
                        abbr=t["abbr"],
                        alt_name=t.get("alt_name"),
                        logo_url=t.get("logo_url"),
                        thumb_url=t.get("thumb_url")
                    )
                    db.add(team)
        db.commit()

        # Seed Matches and Venues
        print("Seeding matches and venues...")
        matches_path = os.path.join(base_path, "matches", "matches.json")
        with open(matches_path, "r") as f:
            matches_data = json.load(f)
            for m in matches_data:
                # Venue
                venue_data = m.get("venue")
                if venue_data and venue_data.get("venue_id"):
                    try:
                        vid = int(venue_data["venue_id"])
                        if not db.query(Venue).filter(Venue.venue_id == vid).first():
                            venue = Venue(
                                venue_id=vid,
                                name=venue_data["name"],
                                location=venue_data.get("location"),
                                country=venue_data.get("country"),
                                timezone=venue_data.get("timezone")
                            )
                            db.add(venue)
                            db.flush() # Flush to catch errors early
                    except Exception as ve:
                        print(f"Error seeding venue {venue_data}: {ve}")
                
                # Match
                if not db.query(Match).filter(Match.match_id == m["match_id"]).first():
                    try:
                        match = Match(
                            match_id=m["match_id"],
                            title=m["title"],
                            short_title=m.get("short_title"),
                            subtitle=m.get("subtitle"),
                            match_number=m.get("match_number"),
                            date_start=datetime.strptime(m["date_start"], "%Y-%m-%d %H:%M:%S") if m.get("date_start") else None,
                            date_end=datetime.strptime(m["date_end"], "%Y-%m-%d %H:%M:%S") if m.get("date_end") else None,
                            venue_id=int(m["venue"]["venue_id"]) if m.get("venue") and m["venue"].get("venue_id") else None,
                            teama_id=m["teama"]["team_id"],
                            teamb_id=m["teamb"]["team_id"],
                            winning_team_id=m.get("winning_team_id") if m.get("winning_team_id") and m.get("winning_team_id") != 0 else None,
                            status_str=m.get("status_str"),
                            status_note=m.get("status_note"),
                            result=m.get("result"),
                            win_margin=m.get("win_margin"),
                            toss_winner_id=m["toss"].get("winner") if m.get("toss") else None,
                            toss_decision=m["toss"].get("decision") if m.get("toss") else None
                        )
                        db.add(match)
                    except Exception as me:
                        print(f"Error seeding match {m['match_id']}: {me}")

        # Seed Standings
        print("Seeding standings...")
        standings_path = os.path.join(base_path, "standings", "standings.json")
        with open(standings_path, "r") as f:
            standings_data = json.load(f)
            # Assuming first round standings are for the group stage
            for s in standings_data["standings"][0]["standings"]:
                if not db.query(Standing).filter(Standing.team_id == s["team"]["tid"]).first():
                    standing = Standing(
                        team_id=s["team"]["tid"],
                        played=int(s["played"]),
                        win=int(s["win"]),
                        loss=int(s["loss"]),
                        nr=int(s.get("nr", 0)),
                        points=int(s["points"]),
                        netrr=float(s["netrr"])
                    )
                    db.add(standing)

        # Seed Top Batsmen (Orange Cap contenders)
        print("Seeding batting stats...")
        batting_path = os.path.join(base_path, "batting_stats", "batting_most_runs.json")
        with open(batting_path, "r") as f:
            batting_data = json.load(f)
            stats_list = batting_data.get("response", {}).get("stats", [])
            for p in stats_list[:20]: # Top 20
                if not db.query(PlayerStat).filter(PlayerStat.player_id == p["player"]["pid"], PlayerStat.stat_type == "batting").first():
                    stat = PlayerStat(
                        player_id=p["player"]["pid"],
                        name=p["player"]["title"],
                        team_abbr=p["team"]["abbr"],
                        runs=int(p["runs"]),
                        average=float(p["average"]) if p.get("average") else 0,
                        strike_rate=float(p["strike"]) if p.get("strike") else 0,
                        stat_type="batting"
                    )
                    db.add(stat)

        # Seed Top Bowlers (Purple Cap contenders)
        print("Seeding bowling stats...")
        bowling_path = os.path.join(base_path, "bowling_stats", "bowling_top_wicket_takers.json")
        if os.path.exists(bowling_path):
            with open(bowling_path, "r") as f:
                bowling_data = json.load(f)
                stats_list = bowling_data.get("response", {}).get("stats", [])
                for p in stats_list[:20]:
                    if not db.query(PlayerStat).filter(PlayerStat.player_id == p["player"]["pid"], PlayerStat.stat_type == "bowling").first():
                        stat = PlayerStat(
                            player_id=p["player"]["pid"],
                            name=p["player"]["title"],
                            team_abbr=p["team"]["abbr"],
                            wickets=int(p["wickets"]),
                            average=float(p["average"]) if p.get("average") else 0,
                            strike_rate=float(p["strike"]) if p.get("strike") else 0,
                            stat_type="bowling"
                        )
                        db.add(stat)

        db.commit()
        db.close()
        print("Seeding completed successfully!")
    except Exception as e:
        print(f"Critical error during seeding: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    seed_data()
