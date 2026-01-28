import json
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from models import Base, Team, Venue, Match

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ipl_data.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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

        db.commit()
        db.close()
        print("Seeding completed successfully!")
    except Exception as e:
        print(f"Critical error during seeding: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    seed_data()
