from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from .database import get_db
from . import models
from . import schemas

app = FastAPI(title="IPL Data Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo purposes, allow all. In production, specify frontend origin.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/teams", response_model=List[schemas.Team])
def get_teams(db: Session = Depends(get_db)):
    return db.query(models.Team).all()

@app.get("/matches", response_model=schemas.MatchList)
def get_matches(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
    team_id: Optional[int] = None,
    venue_id: Optional[int] = None
):
    query = db.query(models.Match)
    if team_id:
        query = query.filter((models.Match.teama_id == team_id) | (models.Match.teamb_id == team_id))
    if venue_id:
        query = query.filter(models.Match.venue_id == venue_id)
    
    total = query.count()
    matches = query.offset(skip).limit(limit).all()
    
    return {"total": total, "matches": matches}

@app.get("/insights/wins_per_team")
def get_wins_per_team(db: Session = Depends(get_db)):
    from sqlalchemy import func
    results = db.query(models.Team.title, func.count(models.Match.match_id).label("wins"))\
        .join(models.Match, models.Team.tid == models.Match.winning_team_id)\
        .group_by(models.Team.title).all()
    return [{"team": r[0], "wins": r[1]} for r in results]

@app.get("/insights/venue_stats")
def get_venue_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func
    results = db.query(models.Venue.name, func.count(models.Match.match_id).label("matches"))\
        .join(models.Match, models.Venue.venue_id == models.Match.venue_id)\
        .group_by(models.Venue.name).all()
    return [{"venue": r[0], "matches": r[1]} for r in results]
