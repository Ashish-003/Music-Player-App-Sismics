package com.sismics.music.core.model.dbi;

import com.google.common.base.Objects;
import com.sismics.util.context.ThreadLocalContext;
import org.skife.jdbi.v2.Handle;

import java.util.Date;

public class DateCommonUpdate extends DateCommon
{
    private Date updateDate;

    DateCommonUpdate(){
        super();
    }
    DateCommonUpdate(Date createDate, Date deleteDate, Date updateDate)
    {
        super(createDate,deleteDate);
        this.updateDate=updateDate;
    }
    /**
     * Getter of updateDate.
     *
     * @return updateDate
     */
    public Date getUpdateDate() {
        return updateDate;
    }

    /**
     * Setter of updateDate.
     *
     * @param updateDate updateDate
     */
    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}