/* */

package main

func (a *app) gameLoop() {
	var rs = a.Runs
	for {
		select {
		case askRun := <-a.Ch.askGame:
			r := rs.newRun(a.Cnf)
			rs[r.Token] = r
			//showMap(r)
			askRun <- *r

		case askTurn := <-a.Ch.askTurn:
			r := rs[askTurn.token]
			action := askTurn.action
			actionCompleted := false
			switch action {
			case "erase":
				if rs.exists(r.Token) {
					r.GameOver = true
					rs.delete(r.Token)
				}
			default:
				actionCompleted = r.moveEntity(0, action)
			}
			if actionCompleted {
				r.moveEntities()
				r.fov.rayCast(*r)
				r.Map.Camera = r.Map.buildView(r.entities[0].Pos)
				r.PublicEntities = r.createPublicEntities()
				r.Turn++
				//showMap(*r)
			}
			if r.entities[0].isDead() {
				r.GameOver = true
			}
			askTurn.comm <- *r
		}
	}
	// UNREACHABLE CODE
}
