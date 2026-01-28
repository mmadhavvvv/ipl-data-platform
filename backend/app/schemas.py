from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Team(BaseModel):
    tid: int
    title: str
    abbr: str
    logo_url: Optional[str]
    thumb_url: Optional[str]

    class Config:
        from_attributes = True

class Venue(BaseModel):
    venue_id: int
    name: str
    location: Optional[str]
    country: Optional[str]

    class Config:
        from_attributes = True

class Match(BaseModel):
    match_id: int
    title: Optional[str]
    match_number: Optional[str]
    date_start: Optional[datetime]
    venue: Optional[Venue]
    teama: Team
    teamb: Team
    winning_team: Optional[Team]
    status_str: Optional[str]
    result: Optional[str]

    class Config:
        from_attributes = True

class MatchList(BaseModel):
    total: int
    matches: List[Match]
