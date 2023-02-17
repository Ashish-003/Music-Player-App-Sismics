package com.sismics.music.core.model.dbi;

import com.google.common.base.Objects;
import com.sismics.util.context.ThreadLocalContext;
import org.skife.jdbi.v2.Handle;

import java.util.Date;

public class DateCommonDisable extends DateCommon
{
    private Date disableDate;

    DateCommonDisable(){
        super();
    }
    DateCommonDisable(Date createDate, Date deleteDate, Date disableDate)
    {
        super(createDate,deleteDate);
        this.disableDate=disableDate;
    }
    /**
     * Getter of disableDate.
     *
     * @return disableDate
     */
    public Date getDisableDate() {
        return disableDate;
    }

    /**
     * Setter of disableDate.
     *
     * @param disableDate disableDate
     */
    public void setDisableDate(Date disableDate) {
        this.disableDate = disableDate;
    }
}